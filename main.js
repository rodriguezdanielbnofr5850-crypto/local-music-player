const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');

// 单实例锁
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    // 如果获取锁失败，说明已经有一个实例在运行，直接退出当前进程
    app.quit();
} else {
    // 监听第二次启动的事件
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 如果主窗口存在，则恢复并聚焦
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    let mainWindow; // 声明主窗口变量

    function createWindow() {
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            title: '音乐都市',
            icon: path.join(__dirname, 'iron.ico'), // 你的图标
        });

        mainWindow.loadFile('song_library.html');
        Menu.setApplicationMenu(null); // 移除菜单栏
    }

    app.whenReady().then(() => {
        createWindow();

        app.on('activate', () => {
            // macOS：当点击 dock 图标且没有窗口时，重新创建窗口
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

    // Windows & Linux：所有窗口关闭时退出应用
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
}