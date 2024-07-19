use crate::errors::CommandResult;
use crate::types::{CommandResponse, ImageSizeCount, JpgImageData, JpgImageInfo, RectData};
use crate::watermark;
use anyhow::Context;
use base64::engine::general_purpose;
use base64::Engine;
use path_slash::PathBufExt;
use std::collections::HashMap;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use walkdir::WalkDir;

#[tauri::command(async)]
#[specta::specta]
#[allow(clippy::cast_possible_truncation)]
#[allow(clippy::needless_pass_by_value)]
#[allow(clippy::cast_sign_loss)]
#[allow(clippy::cast_precision_loss)]
pub fn generate_background(
    app: AppHandle,
    manga_dir: &str,
    rect_data: Option<RectData>,
    width: u32,
    height: u32,
) -> CommandResult<CommandResponse<()>> {
    let cache_dir = app.path().resource_dir().map_err(anyhow::Error::from)?;
    let default_rect_data = RectData {
        left: (width as f32 * 0.835) as u32,
        top: (height as f32 * 0.946) as u32,
        right: (width as f32 * 0.994) as u32,
        bottom: (height as f32 * 0.994) as u32,
    };
    let rect_data = rect_data.unwrap_or(default_rect_data);
    let res = watermark::generate_background(manga_dir, &rect_data, &cache_dir, width, height)?;
    Ok(res)
}

#[tauri::command(async)]
#[specta::specta]
#[allow(clippy::needless_pass_by_value)]
pub fn remove_watermark(
    app: AppHandle,
    manga_dir: &str,
    output_dir: &str,
    black_image_data: JpgImageData,
    white_image_data: JpgImageData,
) -> CommandResult<CommandResponse<()>> {
    let res = watermark::remove(
        &app,
        manga_dir,
        output_dir,
        &black_image_data,
        &white_image_data,
    )?;
    Ok(res)
}

#[tauri::command(async)]
#[specta::specta]
#[allow(clippy::cast_possible_truncation)]
pub fn open_image(path: String) -> CommandResult<CommandResponse<JpgImageData>> {
    let path = PathBuf::from_slash(path);
    let size = imagesize::size(&path)
        .context(format!("获取图片 {} 的尺寸失败", path.display()))
        .map_err(anyhow::Error::from)?;
    let (width, height) = (size.width as u32, size.height as u32);
    let image_data: Vec<u8> = std::fs::read(&path)
        .context(format!("读取图片 {} 失败", path.display()))
        .map_err(anyhow::Error::from)?;
    // 将图片数据转换为base64编码
    let base64 = general_purpose::STANDARD.encode(image_data);
    // JpgImage对象
    let data = JpgImageData {
        info: JpgImageInfo {
            width,
            height,
            path: path.display().to_string(),
        },
        base64,
    };
    let res = CommandResponse {
        code: 0,
        msg: String::new(),
        data,
    };
    Ok(res)
}

#[tauri::command(async)]
#[specta::specta]
#[allow(clippy::cast_possible_truncation)]
pub fn get_image_size_count(manga_dir: &str) -> CommandResponse<Vec<ImageSizeCount>> {
    // 用于存储不同尺寸的图片的数量
    let mut size_count: HashMap<(u32, u32), u32> = HashMap::new();
    // 遍历漫画目录下的所有文件，统计不同尺寸的图片的数量
    for entry in WalkDir::new(PathBuf::from_slash(manga_dir))
        .max_depth(2) // 一般第一层目录是章节目录，第二层目录是图片文件
        .into_iter()
        .filter_map(Result::ok)
    {
        let path = entry.into_path();
        if path.is_file() && path.extension().map_or(false, |e| e == "jpg") {
            let Ok(size) = imagesize::size(&path) else {
                continue;
            };
            let key = (size.width as u32, size.height as u32);
            let count = size_count.entry(key).or_insert(0);
            *count += 1;
        }
    }
    // 将统计结果转换为Vec<ImageSizeCount>
    let mut image_size_count: Vec<ImageSizeCount> = size_count
        .into_iter()
        .map(|((width, height), count)| ImageSizeCount {
            width,
            height,
            count,
        })
        .collect();
    // 以count降序排序
    image_size_count.sort_by(|a, b| b.count.cmp(&a.count));
    // 返回结果
    CommandResponse {
        code: 0,
        msg: String::new(),
        data: image_size_count,
    }
}

#[tauri::command(async)]
#[specta::specta]
#[allow(clippy::cast_possible_truncation)]
pub fn get_jpg_image_infos(manga_dir: &str) -> CommandResponse<Vec<JpgImageInfo>> {
    // 用于存储jpg图片的信息
    let mut jpg_image_infos = vec![];
    // 遍历漫画目录下的所有文件，获取jpg图片的信息
    for entry in WalkDir::new(PathBuf::from_slash(manga_dir))
        .max_depth(2) //  一般第一层目录是章节目录，第二层目录是图片文件
        .into_iter()
        .filter_map(Result::ok)
    {
        let path = entry.into_path();
        if path.is_file() && path.extension().map_or(false, |e| e == "jpg") {
            let Ok(size) = imagesize::size(&path) else {
                continue;
            };
            jpg_image_infos.push(JpgImageInfo {
                width: size.width as u32,
                height: size.height as u32,
                path: path.display().to_string(),
            });
        }
    }
    CommandResponse {
        code: 0,
        msg: String::new(),
        data: jpg_image_infos,
    }
}

#[tauri::command(async)]
#[specta::specta]
pub fn show_path_in_file_manager(path: &str) {
    let path = PathBuf::from_slash(path);
    showfile::show_path_in_file_manager(path);
}
