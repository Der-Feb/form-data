import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Pressable,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

const HOBBY_OPTIONS = ['Reading', 'Music', 'Sports', 'Travel'];

export default function App() {
  // Text inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');

  // Selection inputs
  const [country, setCountry] = useState('rwanda');
  const [gender, setGender] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [notifications, setNotifications] = useState(false);

  // Slider, date, time
  const [volume, setVolume] = useState(50);
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // File and camera
  const [file, setFile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  function handleAgeChange(text) {
    setAge(text.replace(/[^0-9]/g, ''));
  }

  function toggleHobby(hobby) {
    setHobbies((current) =>
      current.includes(hobby)
        ? current.filter((item) => item !== hobby)
        : [...current, hobby]
    );
  }

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  async function openCamera() {
    if (!permission || !permission.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        console.log('Camera permission denied');
        return;
      }
    }
    setShowCamera(true);
  }

  async function capturePhoto() {
    if (cameraRef.current) {
      const picture = await cameraRef.current.takePictureAsync();
      setPhoto(picture);
      setShowCamera(false);
    }
  }

  const handleSubmit = () => {
    const formData = {
      name,
      email,
      password,
      phone,
      age,
      bio,
      country,
      gender,
      hobbies,
      agreeTerms,
      notifications,
      volume: Math.round(volume),
      birthDate: birthDate.toDateString(),
      reminderTime: reminderTime.toLocaleTimeString(),
      photo: photo
        ? {
          width: photo.width,
          height: photo.height,
          // on web the uri is a very long base64 string, so we shorten it for the log
          uri: photo.uri.slice(0, 60) + '...',
        }
        : null,
      file: file
        ? { name: file.name, uri: file.uri, size: file.size, mimeType: file.mimeType }
        : null,
    };

    console.log('Form submitted:', formData);
  };

  return (
    <ScrollView>
      <View>
        <Text>Registration Form</Text>

        <Text>Name</Text>
        <TextInput
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text>Email</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text>Password</Text>
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text>Phone</Text>
        <TextInput
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          inputMode="tel"
        />

        <Text>Age</Text>
        <TextInput
          placeholder="Enter your age"
          value={age}
          onChangeText={handleAgeChange}
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={3}
        />

        <Text>Bio</Text>
        <TextInput
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />

        <Text>Country</Text>
        <Picker
          selectedValue={country}
          onValueChange={(value) => setCountry(value)}
        >
          <Picker.Item label="Rwanda" value="rwanda" />
          <Picker.Item label="Kenya" value="kenya" />
          <Picker.Item label="Uganda" value="uganda" />
          <Picker.Item label="Tanzania" value="tanzania" />
        </Picker>

        <Text>Gender</Text>
        <Pressable onPress={() => setGender('male')}>
          <Text>{gender === 'male' ? '(●)' : '( )'} Male</Text>
        </Pressable>
        <Pressable onPress={() => setGender('female')}>
          <Text>{gender === 'female' ? '(●)' : '( )'} Female</Text>
        </Pressable>
        <Pressable onPress={() => setGender('other')}>
          <Text>{gender === 'other' ? '(●)' : '( )'} Other</Text>
        </Pressable>

        <Text>Hobbies</Text>
        {HOBBY_OPTIONS.map((hobby) => (
          <View
            key={hobby}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Checkbox
              value={hobbies.includes(hobby)}
              onValueChange={() => toggleHobby(hobby)}
            />
            <Text> {hobby}</Text>
          </View>
        ))}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox value={agreeTerms} onValueChange={setAgreeTerms} />
          <Text> I agree to the terms</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>Enable notifications </Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>

        <Text>Volume: {Math.round(volume)}</Text>
        <Slider
          minimumValue={0}
          maximumValue={100}
          value={volume}
          onValueChange={setVolume}
        />

        <Text>Birth date: {birthDate.toDateString()}</Text>
        {Platform.OS === 'web' ? (
          React.createElement('input', {
            type: 'date',
            value: birthDate.toISOString().split('T')[0],
            onChange: (e) => {
              if (e.target.value) {
                setBirthDate(new Date(e.target.value));
              }
            },
          })
        ) : (
          <>
            <Button title="Pick a date" onPress={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setBirthDate(selectedDate);
                  }
                }}
              />
            )}
          </>
        )}

        <Text>Reminder time: {reminderTime.toLocaleTimeString()}</Text>
        {Platform.OS === 'web' ? (
          React.createElement('input', {
            type: 'time',
            value: reminderTime.toTimeString().slice(0, 5),
            onChange: (e) => {
              if (e.target.value) {
                const [hours, minutes] = e.target.value.split(':');
                const next = new Date(reminderTime);
                next.setHours(Number(hours), Number(minutes));
                setReminderTime(next);
              }
            },
          })
        ) : (
          <>
            <Button title="Pick a time" onPress={() => setShowTimePicker(true)} />
            {showTimePicker && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setReminderTime(selectedTime);
                  }
                }}
              />
            )}
          </>
        )}

        <Text>Camera</Text>
        {showCamera ? (
          <>
            <CameraView
              ref={cameraRef}
              style={{ width: '100%', height: 300 }}
              facing="front"
            />
            <Button title="Capture" onPress={capturePhoto} />
            <Button title="Close camera" onPress={() => setShowCamera(false)} />
          </>
        ) : (
          <Button title="Open camera" onPress={openCamera} />
        )}
        {photo && <Text>Photo captured: {photo.width} x {photo.height}</Text>}

        <Text>File</Text>
        <Button title="Pick a file" onPress={pickFile} />
        {file && <Text>Selected file: {file.name}</Text>}

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}