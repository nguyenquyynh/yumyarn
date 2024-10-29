import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';

const ShakeDetection = () => {
  const [shakeDetected, setShakeDetected] = useState(false);

  useEffect(() => {
    // Thiết lập khoảng thời gian cập nhật cho cảm biến
    setUpdateIntervalForType(SensorTypes.accelerometer, 500); // 100ms

    const subscription = accelerometer
      .pipe(
        map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)) // Tính độ lớn
      )
      .subscribe((acceleration) => {
        const value = 20
        // Math.floor(Math.random() * 50 + 50)
        console.log(acceleration, value);

        // Kiểm tra nếu độ lớn lớn hơn một ngưỡng nhất định
        if (acceleration > value) { // Ngưỡng có thể thay đổi
          setShakeDetected(true);
          setTimeout(() => setShakeDetected(false), 2000); // Đặt lại trạng thái sau 2 giây
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{shakeDetected ? 'Đã lắc điện thoại!' : 'Lắc điện thoại để kiểm tra.'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default ShakeDetection;
