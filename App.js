import React, { useState } from 'react';
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
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const SKILLS = ['JavaScript', 'Python', 'Design', 'Marketing'];

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
  const [skills, setSkills] = useState([]);
  const [experienceIndex, setExperienceIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [notifications, setNotifications] = useState(false);

  // Slider and date
  const [volume, setVolume] = useState(50);
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  function handleAgeChange(text) {
    const cleanText = text.replace(/[^0-9]/g, '');
    setAge(cleanText);
  }

  function toggleHobby(hobby) {
    setHobbies((current) =>
      current.includes(hobby)
        ? current.filter((item) => item !== hobby)
        : [...current, hobby]
    );
  }

  function toggleSkill(skill) {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
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
      skills,
      experience: EXPERIENCE_LEVELS[experienceIndex],
      quantity,
      agreeTerms,
      notifications,
      volume: Math.round(volume),
      birthDate: birthDate.toDateString(),
      reminderTime: reminderTime.toLocaleTimeString(),
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

        <Text>Experience level</Text>
        <SegmentedControl
          values={EXPERIENCE_LEVELS}
          selectedIndex={experienceIndex}
          onChange={(event) =>
            setExperienceIndex(event.nativeEvent.selectedSegmentIndex)
          }
        />

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
        {['Reading', 'Music', 'Sports', 'Travel'].map((hobby) => (
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

        <Text>Skills</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {SKILLS.map((skill) => {
            const selected = skills.includes(skill);
            return (
              <Pressable key={skill} onPress={() => toggleSkill(skill)}>
                <Text>{selected ? `[x] ${skill}` : `[ ] ${skill}`}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text>Quantity: {quantity}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            title="-"
            onPress={() => setQuantity((current) => Math.max(0, current - 1))}
          />
          <Button
            title="+"
            onPress={() => setQuantity((current) => current + 1)}
          />
        </View>

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

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}