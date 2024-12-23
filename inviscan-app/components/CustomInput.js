import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, set, setDate } from "date-fns";
import { Picker } from "@react-native-picker/picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const now = new Date();

const useAnimatedStyles = (value) => {
  const { width } = Dimensions.get("window");
  const placeholderAnim = React.useRef(new Animated.Value(15)).current;
  const lineAnim = React.useRef(new Animated.Value(width)).current;
  const [focus, setFocus] = React.useState(false);

  React.useEffect(() => {
    if (focus || value) {
      Animated.timing(lineAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(placeholderAnim, {
        toValue: 40,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(lineAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start();
      Animated.timing(placeholderAnim, {
        toValue: 15,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [focus, value]);

  return { focus, setFocus, placeholderAnim, lineAnim };
};

const InputBase = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  error,
  secureTextEntry,
  toggleSecureTextEntry,
  inputGroupStyle = {},
  ...inputProps
}) => {
  const { setFocus, placeholderAnim, lineAnim } = useAnimatedStyles(value);

  return (
    <View style={{ ...styles.inputGroup, ...inputGroupStyle }}>
      <View style={styles.formControl}>
        <View style={styles.field}>
          <View
            style={[
              styles.line,
              { backgroundColor: error ? "#92000A" : "#adadad" },
            ]}
          />
          <Animated.View style={[styles.focusLine, { right: lineAnim }]}>
            <LinearGradient
              colors={["#7B55E0", "#000"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
          <TextInput
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={styles.textInput}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            value={value}
            secureTextEntry={secureTextEntry}
            {...inputProps}
          />
          {toggleSecureTextEntry && (
            <Pressable style={styles.security} onPress={toggleSecureTextEntry}>
              <Ionicons
                name={secureTextEntry ? "eye" : "eye-off"}
                size={24}
                color="black"
              />
            </Pressable>
          )}
        </View>
        <Animated.Text
          style={[styles.placeholder, { bottom: placeholderAnim }]}
        >
          {placeholder}
        </Animated.Text>
      </View>
    </View>
  );
};

export const InputNumber = ({ value, onChangeText, placeholder, error }) => (
  <InputBase
    value={value}
    onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, ""))}
    placeholder={placeholder}
    keyboardType="numeric"
    error={error}
  />
);

export const Input = ({ value, onChangeText, placeholder, error }) => (
  <InputBase
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    error={error}
  />
);

export const InputPassword = ({ value, onChangeText, placeholder, error }) => {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  return (
    <InputBase
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      error={error}
      secureTextEntry={secureTextEntry}
      toggleSecureTextEntry={() => setSecureTextEntry(!secureTextEntry)}
    />
  );
};

export const InputDate = ({
  value,
  onChange,
  placeholder,
  error,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const togglePicker = () => {
    setShow(!show);
  };
  return (
    <>
      <Pressable
        onPress={() => {
          togglePicker();
        }}
      >
        <InputBase
          value={value?.toLocaleDateString("pt-BR") ?? ""}
          placeholder={placeholder}
          error={error}
          editable={false}
        />
      </Pressable>

      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode={"date"}
          display="default"
          onChange={(e, selectedDate) => {
            togglePicker();
            if (e.type === "set") {
              onChange(selectedDate);
            }
          }}
          {...props}
        />
      )}
    </>
  );
};

export const InputTime = ({
  value,
  onChange,
  placeholder,
  error,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(false);

  const togglePicker = () => {
    setShow(!show);
  };

  return (
    <>
      <Pressable
        onPress={() => {
          togglePicker();
        }}
      >
        <InputBase
          value={value ? format(value, "HH:mm") : ""}
          placeholder={placeholder}
          error={error}
          editable={false}
        />
      </Pressable>

      {show && (
        <DateTimePicker
          value={value ?? new Date(now.setHours(18, 0, 0, 0))}
          mode={"time"}
          display="default"
          onChange={(e, selectedDate) => {
            togglePicker();
            if (e.type === "set") {
              onChange(selectedDate);
            }
          }}
          {...props}
        />
      )}
    </>
  );
};

export const SelectPicker = ({
  selectedValue,
  onChange,
  placeholder,
  error,
  items,
  ...props
}) => {
  const pickerRef = useRef();
  const [selected, setSelected] = useState();
  const open = () => {
    pickerRef.current.focus();
  };

  useEffect(() => {
    console.log(selectedValue);
    const pickerItem = items.find((x) => x.value === selectedValue);
    setSelected(pickerItem);
  }, [selectedValue]);

  return (
    <>
      <Pressable
        style={styles.formControl}
        onPress={() => {
          open();
        }}
      >
        <InputBase
          value={selected?.label}
          placeholder={placeholder}
          error={error}
          editable={false}
        />
        <FontAwesomeIcon style={styles.right} icon={faChevronDown} size={16} />
      </Pressable>

      <Picker
        style={{ display: "none" }}
        ref={pickerRef}
        onValueChange={onChange}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    backgroundColor: "#FFF",
    flexDirection: "column",
    gap: 32,
    width: "100%",
    marginTop: 22,
  },
  formControl: {
    position: "relative",
  },
  field: {
    position: "relative",
    overflow: "hidden",
  },
  placeholder: {
    position: "absolute",
    left: 15,
    color: "#999",
    pointerEvents: "none",
    fontFamily: "PoppinsRegular",
  },
  textInput: {
    padding: 16,
    paddingBottom: 12,
    fontSize: 16,
    width: "100%",
    color: "#000",
    fontFamily: "PoppinsRegular",
    outlineStyle: "none",
  },
  line: {
    position: "absolute",
    width: "100%",
    height: 2,
    bottom: 0,
  },
  focusLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    bottom: 0,
  },
  security: {
    position: "absolute",
    right: 10,
    padding: 10,
    bottom: 5,
  },
  right: {
    position: "absolute",
    right: 20,
    bottom: 15,
  },
});
