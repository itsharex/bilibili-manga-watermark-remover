// @ts-nocheck
         // This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

         /** user-defined commands **/

         export const commands = {
async generateBackground(mangaDir: string, rectData: RectData | null, width: number, height: number) : Promise<Result<CommandResponse<null>, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("generate_background", { mangaDir, rectData, width, height }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async removeWatermark(mangaDir: string, outputDir: string, backgroundsData: ([JpgImageData, JpgImageData])[]) : Promise<Result<CommandResponse<null>, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("remove_watermark", { mangaDir, outputDir, backgroundsData }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openImage(path: string) : Promise<Result<CommandResponse<JpgImageData>, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("open_image", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getMangaDirData(mangaDir: string) : Promise<Result<CommandResponse<MangaDirData[]>, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("get_manga_dir_data", { mangaDir }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getJpgImageInfos(mangaDir: string) : Promise<CommandResponse<JpgImageInfo[]>> {
return await TAURI_INVOKE("get_jpg_image_infos", { mangaDir });
},
async showPathInFileManager(path: string) : Promise<void> {
await TAURI_INVOKE("show_path_in_file_manager", { path });
},
async getBackgroundDirRelativePath(mangaDir: string, width: number, height: number) : Promise<Result<CommandResponse<string>, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("get_background_dir_relative_path", { mangaDir, width, height }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getBackgroundDirAbsPath(mangaDir: string, width: number, height: number) : Promise<Result<CommandResponse<string>, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("get_background_dir_abs_path", { mangaDir, width, height }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getConfig() : Promise<CommandResponse<Config>> {
return await TAURI_INVOKE("get_config");
},
async saveConfig(config: Config) : Promise<Result<CommandResponse<null>, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("save_config", { config }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
}
}

         /** user-defined events **/

export const events = __makeEvents__<{
removeWatermarkStartEvent: RemoveWatermarkStartEvent,
removeWatermarkSuccessEvent: RemoveWatermarkSuccessEvent,
removeWatermarkErrorEvent: RemoveWatermarkErrorEvent,
removeWatermarkEndEvent: RemoveWatermarkEndEvent
}>({
removeWatermarkStartEvent: "remove-watermark-start-event",
removeWatermarkSuccessEvent: "remove-watermark-success-event",
removeWatermarkErrorEvent: "remove-watermark-error-event",
removeWatermarkEndEvent: "remove-watermark-end-event"
})

         /** user-defined statics **/

         

/** user-defined types **/

export type CommandError = string
export type CommandResponse<T> = { code: number; msg: string; data: T }
export type Config = { outputDir: string }
export type JpgImageData = { info: JpgImageInfo; base64: string }
export type JpgImageInfo = { width: number; height: number; path: string }
export type MangaDirData = { width: number; height: number; count: number; blackBackground: JpgImageData | null; whiteBackground: JpgImageData | null }
export type RectData = { left: number; top: number; right: number; bottom: number }
export type RemoveWatermarkEndEvent = RemoveWatermarkEndEventPayload
export type RemoveWatermarkEndEventPayload = { dir_path: string }
export type RemoveWatermarkErrorEvent = RemoveWatermarkErrorEventPayload
export type RemoveWatermarkErrorEventPayload = { dir_path: string; img_path: string; err_msg: string }
export type RemoveWatermarkStartEvent = RemoveWatermarkStartEventPayload
export type RemoveWatermarkStartEventPayload = { dir_path: string; total: number }
export type RemoveWatermarkSuccessEvent = RemoveWatermarkSuccessEventPayload
export type RemoveWatermarkSuccessEventPayload = { dir_path: string; img_path: string; current: number }

/** tauri-specta globals **/

         import { invoke as TAURI_INVOKE } from "@tauri-apps/api/core";
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { type WebviewWindow as __WebviewWindow__ } from "@tauri-apps/api/webviewWindow";

type __EventObj__<T> = {
  listen: (
    cb: TAURI_API_EVENT.EventCallback<T>
  ) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
  once: (
    cb: TAURI_API_EVENT.EventCallback<T>
  ) => ReturnType<typeof TAURI_API_EVENT.once<T>>;
  emit: T extends null
    ? (payload?: T) => ReturnType<typeof TAURI_API_EVENT.emit>
    : (payload: T) => ReturnType<typeof TAURI_API_EVENT.emit>;
};

export type Result<T, E> =
  | { status: "ok"; data: T }
  | { status: "error"; error: E };

function __makeEvents__<T extends Record<string, any>>(
  mappings: Record<keyof T, string>
) {
  return new Proxy(
    {} as unknown as {
      [K in keyof T]: __EventObj__<T[K]> & {
        (handle: __WebviewWindow__): __EventObj__<T[K]>;
      };
    },
    {
      get: (_, event) => {
        const name = mappings[event as keyof T];

        return new Proxy((() => {}) as any, {
          apply: (_, __, [window]: [__WebviewWindow__]) => ({
            listen: (arg: any) => window.listen(name, arg),
            once: (arg: any) => window.once(name, arg),
            emit: (arg: any) => window.emit(name, arg),
          }),
          get: (_, command: keyof __EventObj__<any>) => {
            switch (command) {
              case "listen":
                return (arg: any) => TAURI_API_EVENT.listen(name, arg);
              case "once":
                return (arg: any) => TAURI_API_EVENT.once(name, arg);
              case "emit":
                return (arg: any) => TAURI_API_EVENT.emit(name, arg);
            }
          },
        });
      },
    }
  );
}

     