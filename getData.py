import json
import os

def read_json_file(file_path):
    if not os.path.exists(file_path):
        print(f"File {file_path} does not exist.")
        return None
    
    with open(file_path, 'r') as file:
        try:
            data = json.load(file)
        except json.JSONDecodeError as e:
            print(f"Error reading JSON from file {file_path}: {e}")
            return None
    
    return data

def main():
    file_path = 'data.json'  # Path to your data.json file
    data = read_json_file(file_path)
    if data is not None:
        print(json.dumps(data, indent=2))  # Pretty-print the JSON data

if __name__ == '__main__':
    main()
