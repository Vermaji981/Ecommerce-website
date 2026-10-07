# Backend Notes

## MongoDB setup

The backend is now configured to work in two modes:

1. If MongoDB is running and reachable, the app will connect to it automatically.
2. If MongoDB is not available, the app will continue using in-memory fallback storage so the site still works.

### Local MongoDB (Windows)

If you want real MongoDB persistence on your Windows machine, start it with:

```powershell
cd "C:\Program Files\MongoDB\Server\8.3\bin"
./mongod.exe --dbpath "C:\data\db" --logpath "C:\data\log\mongod.log" --bind_ip 127.0.0.1 --port 27017
```

Then set the environment variable:

```powershell
$env:MONGO_URI="mongodb://127.0.0.1:27017/mywebsite"
```

### If the server still refuses connections

- Make sure no other app is already using port 27017
- Make sure the folders C:\data\db and C:\data\log are writable
- Restart the terminal after setting the environment variable
