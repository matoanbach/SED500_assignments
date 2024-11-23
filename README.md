
- Create and activate a python virtual environment
**- Note:** If there is any virtual existed before, delete it and create a new one (referred to the last step below)
```sh
python3 -m venv venv # create a virtual environment named "venv" at the current directory
source venv/bin/activate # activate the virtual environment
```

- Verify if the virtual environment is activated
```sh
which python3 # expected: /Users/tieuma/Library/CloudStorage/OneDrive-Seneca/Seneca/SEMESTER5/SED500/a4/a4/venv/bin/python3
which pip3 # expected: /Users/tieuma/Library/CloudStorage/OneDrive-Seneca/Seneca/SEMESTER5/SED500/a4/a4/venv/bin/pip3
```

- Install dependencies
```sh
pip3 install selenium
pip3 install beautifulsoup4
```

- Make sure your website is up and running at this url
```sh
http://127.0.0.1:5500/StockPicker.html
```


- Run tests:
```sh
python3 test_main.py
```

- Expected results:
```sh
Test RE-01.3: Done - Result: Passed ✅
Test RE-01.5: Done - Result: Failed ❌
Test RE-01.6: Done - Result: Passed ✅
Test RE-01.7: Done - Result: Passed ✅
Test RE-02.2: Done - Result: Passed ✅
Test RE-02.3: Done - Result: Passed ✅
Test RE-03: Done - Result: Passed ✅
Test RE-08: Done - Result: Failed ❌
```

- Deactivate and delete the virtual environment before leaving, please
```sh
deactivate
rm -rf venv
rm -rf __pycache__
```