// @ts-nocheck
         // This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

         /** user-defined commands **/

         export const commands = {
async generateBackground(mangaDir: string, rectData: RectData, height: number, width: number) : Promise<Result<[string, string], CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("generate_background", { mangaDir, rectData, height, width }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async removeWatermark(mangaDir: string, outputDir: string, blackImageData: JpgImageData, whiteImageData: JpgImageData) : Promise<Result<null, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("remove_watermark", { mangaDir, outputDir, blackImageData, whiteImageData }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async openImage(path: string) : Promise<Result<JpgImageData, CommandError>> {
try {
    return { status: "ok", data: await TAURI_INVOKE("open_image", { path }) };
} catch (e) {
    if(e instanceof Error) throw e;
    else return { status: "error", error: e  as any };
}
},
async getImageSizeCount(mangaDir: string) : Promise<ImageSizeCount[]> {
return await TAURI_INVOKE("get_image_size_count", { mangaDir });
},
async getJpgImageInfos(mangaDir: string) : Promise<JpgImageInfo[]> {
return await TAURI_INVOKE("get_jpg_image_infos", { mangaDir });
},
async showPathInFileManager(path: string) : Promise<void> {
await TAURI_INVOKE("show_path_in_file_manager", { path });
}
}

         /** user-defined events **/



         /** user-defined statics **/

         

/** user-defined types **/

export type CommandError = string
export type ImageSizeCount = { height: number; width: number; count: number }
export type JpgImageData = { info: JpgImageInfo; base64: string }
export type JpgImageInfo = { height: number; width: number; path: string }
export type RectData = { left: number; top: number; right: number; bottom: number }

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

     