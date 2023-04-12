from typing import Dict
import fire
from pathlib import Path
import json


class KeyMapGenerator:
    def __init__(self) -> None:
        pass

    def __add_rule(self, target_json_path: str, rule: Dict):
        with open(target_json_path, "r") as fr:
            settings = json.load(fr)
        settings["rules"].append(rule)
        with open(target_json_path, "w", encoding="utf8") as fw:
            json.dump(settings, fw, ensure_ascii=False, indent="  ")

    def generate_finder_keymap(self, key: str, folder_name: str, open_folder_path: str):
        folder_path = Path(open_folder_path)
        if not folder_path.is_dir():
            raise ValueError("folder_path is not valid.")

        open_rule = {
            "description": f"{key}キーで{folder_name}フォルダをオープンする",
            "manipulators": [
                {
                    "type": "basic",
                    "from": {"key_code": f"{key}"},
                    "conditions": [
                        {"type": "variable_if", "name": "finder_open", "value": 100}
                    ],
                    "to": [
                        {"shell_command": f"open {open_folder_path}"},
                        {"set_variable": {"name": "finder_open", "value": 0}},
                    ],
                }
            ],
        }
        self.__add_rule("./finder_open.json", open_rule)

    def generate_gdrive_keymap(self, key: str, gdrive_name: str, gdrive_url: str):
        gdrive_open_setting = {
            "description": f"{key}キーを押すことでgdriveの{gdrive_name}ページをオープンする",
            "manipulators": [
                {
                    "type": "basic",
                    "from": {"key_code": f"{key}"},
                    "conditions": [
                        {"type": "variable_if", "name": "website_open", "value": 100}
                    ],
                    "to": [
                        {"shell_command": f"open '{gdrive_url}'"},
                        {"set_variable": {"name": "website_open", "value": 0}},
                    ],
                }
            ],
        }
        self.__add_rule("./website_open.json", gdrive_open_setting)


if __name__ == "__main__":
    fire.Fire(KeyMapGenerator)
