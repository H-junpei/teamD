# teamD
### backend のライブラリを追加するとき
1. `backend/.venv` を有効化
2. `python -m pip install <package>` を実行
3. `python -m pip freeze > requirements.txt`
4. `requirements.txt` を一緒にコミット

### frontend のライブラリを追加するとき
1. `frontend` で `npm.cmd install <package>` を実行
2. `package.json` と `package-lock.json` を一緒にコミット
