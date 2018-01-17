import subprocess

if __name__ == '__main__':
	subprocess.call('node server/models/db.js', shell=True)
	subprocess.call('node server/helper/populatedb.js', shell=True)
	subprocess.call('yarn dev', shell=True)
