import json
import os
import typing


def merge_json(json_files: typing.List[str], filename: str):
    """
    Merge multiple JSON files into one.
    """
    merged_json = {"title": "my keybind settings json", "rules": []}
    for json_file in json_files:
        with open(json_file, "r") as f:
            json_data: dict = json.load(f)
            merged_json["rules"].extend(json_data["rules"])
    with open(filename, "w") as f:
        json.dump(merged_json, f)


def bundle_keymap(source_dir: str, output_filename: str) -> None:
    json_files = []
    for filename in os.listdir(source_dir):
        if filename.endswith(".json"):
            json_files.append(os.path.join(source_dir, filename))

    merge_json(json_files, output_filename)


if __name__ == "__main__":
    bundle_keymap("./memofile_keymap", "./memofile_keymap.json")

    json_list = [
        "./project_memo_common.json",
        "./mode_transition.json",
        "./finder_open.json",
        "./application_focus.json",
        "./input_mode_common.json",
        "./vscode.json",
        "./cursor_move_mode.json",
        "./hankaku_eisuu_input_mode.json",
        "./japanease_input_mode.json",
        "./select_mode.json",
        "./sub_cursor_move.json",
        "./website_open.json",
        "./chrome.json",
        "./memofile_keymap.json",
        "./keystroke_resetter.json",
    ]
    merge_json(json_list, "./merged.json")
    os.remove("./memofile_keymap.json")
