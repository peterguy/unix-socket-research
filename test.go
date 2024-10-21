package main

import (
	"fmt"
	"net"
	"os"
	"path/filepath"
)

func isValidUnixSocketConnect(path string) (bool, error) {
	conn, err := net.Dial("unix", path)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}
	defer conn.Close()

	return true, nil
}

func isValidUnixSocket(path string) (bool, error) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			return false, nil
		}
		return false, err
	}

	mode := fileInfo.Mode()
	if mode&os.ModeSocket == 0 {
		return false, nil
	}

	return true, nil
}

func main() {
	currentDir, err := os.Getwd()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	isValid, err := isValidUnixSocketConnect(filepath.Join(currentDir, "my_socket.sock"))
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	if isValid {
		fmt.Println("The path is a valid Unix socket.")
	} else {
		fmt.Println("The path is not a valid Unix socket.")
	}
}
