import tomllib

with open("pyproject.toml", "rb") as f:
    pyproject_data = tomllib.load(f)

print ("-------------------------------------------------------------------")
print ("Project Name : ",pyproject_data["project"]["name"])
print ("Project Version : ",pyproject_data["project"]["version"])
print ("Project Description : ",pyproject_data["project"]["description"])
print ("-------------------------------------------------------------------")

for dep in pyproject_data["project"]["dependencies"]:
    print(dep)