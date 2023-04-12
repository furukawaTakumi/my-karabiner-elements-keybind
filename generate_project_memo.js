
function main() {
  createProjectMemos("AI絵師", "x")
}

function createProjectMemos(projectName, bindKey) {
  const memoTypes = [
    'Todoメモ',
    'アイデアメモ',
    '長期の目標・戦略・計画メモ',
    '低優先度TODOメモ',
    'バックアップメモ'
  ]
  const [memoNameToUrl, projectFolder] = createMemosToDrive(projectName, memoTypes)
  createKeycustomizeSettings(projectName, memoNameToUrl, bindKey, projectFolder)
}

function createMemosToDrive(projectName, memoTypes) {
  const projectRootFolderID = '1Uz8bbykIuVDJ_KIFrcLdRz8Q-Fq_iZSv'

  const projectRootFolder = DriveApp.getFolderById(projectRootFolderID)
  const projectFolder = projectRootFolder.createFolder(projectName)

  const resultMemos = {}
  memoTypes.forEach((memoTitle) => {
    const document = DocumentApp.create(memoTitle + '_' + projectName)
    const documentId = document.getId()
    const driveFile = DriveApp.getFileById(documentId)
    projectFolder.addFile(driveFile)
    resultMemos[memoTitle] = document.getUrl()
  })
  return [resultMemos, projectFolder]
}

function createKeycustomizeSettings(projectName, memoNameToUrl, bindKey, projectFolder) {
  const keyArray = "asdfgqwertzxcvb"
  const commonRule = {
    "description": projectName + "プロジェクトのメモファイルを開くための二つ目のキーストローク",
    "manipulators": [
      {
        "type": "basic",
        "from": {
          "key_code": `${bindKey.toLowerCase()}`,
          "modifiers": {
            "optional": [
              "left_option"
            ]
          }
        },
        "to": [
          {
            "set_variable": {
              "name": "project_memo_open",
              "value": bindKey.charCodeAt()
            }
          }
        ],
        "conditions": [
          {
            "type": "variable_if",
            "name": "project_memo_open",
            "value": 1
          }
        ],
        "to_delayed_action": {
          "to_if_invoked": [
            {
              "set_variable": {
                "name": "project_memo_open",
                "value": 0
              }
            }
          ]
        }
      }
    ]
  }
  const rules = Object.entries(memoNameToUrl).map(([name, url], index) => {
    return {
      "description": `option_leftを押しながらhキーを入力した後に，${bindKey}を入力し，${keyArray[index]}を入力した時，${projectName}の${name}を開く`,
      "manipulators": [
        {
          "type": "basic",
          "from": {
            "key_code": `${keyArray[index]}`
          },
          "conditions": [
            {
              "type": "variable_if",
              "name": "project_memo_open",
              "value": bindKey.charCodeAt()
            }
          ],
          "to": [
            {
              "shell_command": `open '${url}'`
            },
            {
              "set_variable": {
                "name": "project_memo_open",
                "value": 0
              }
            }
          ]
        }
      ]
    }
  })
  const source = {
    title: `${projectName}プロジェクトのメモを開くコマンド`,
    rules: [commonRule, ...rules]
  }
  const sourceParsedJson = JSON.stringify(source)
  exportJsonFile(`${projectName}_keymapsource`, sourceParsedJson, projectFolder)
}

function exportJsonFile(filename, jsonData, saveFolder) {
  const contentType = "text/plain"
  const charSet = "UTF-8"
  const jsonBlob = Utilities.newBlob("", contentType, `${filename}.json`).setDataFromString(jsonData, charSet)
  const jsonFile = saveFolder.createFile(jsonBlob)

  const downloadUrl = jsonFile.getDownloadUrl()
  console.log("this is keycustomize download url : ", downloadUrl)
}