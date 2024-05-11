# Getting Started

Để run app npm run yumyarn

>**Note**: 
Các bước chỉnh lại thư viện react native vision camera

Bước 1: Vào Android studio 

Bước 2: Mở thư mục android của project này
         Chờ build hoàn tất 

   Lưu ý: Vào cài đặt rồi vào SDK manager rồi SDK tool tìm NDK 26.1. nếu chưa cài hãy cài 
Bước 3: mở folder react native vision camera 
         rồi vào folder kotlin + java
         tiếp đến là folder com.mrousavy.camera
         rồi sau đó folder frameprocessos
         rồi mở file VisinCameraProxy.kt
Bước 4: thêm dòng này ngay đầu file 
      @file:OptIn(FrameworkAPI::class)
         
