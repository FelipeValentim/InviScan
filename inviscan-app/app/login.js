import H1 from "@/components/H1";
import H2 from "@/components/H2";
import H3 from "@/components/H3";
import Input from "@/components/Input";
import InputPassword from "@/components/InputPassword";
import { primaryColor, screenHeight, screenWidth } from "@/constants/Default";
import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AccountAPI } from "@/services/AccountAPI";
import { setToken } from "@/storage/AsyncStorage";

import { useDispatch } from "react-redux";
import ButtonLoading from "@/components/ButtonLoading";
import { signIn } from "@/redux/token";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const [user, setUser] = React.useState({ email: "", password: "" });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: undefined,
    password: undefined,
    invalidCredentials: undefined,
  });

  const setEmail = (value) => {
    if (value) {
      setErrors({ ...errors, email: undefined });
      setUser({ ...user, email: value });
    } else {
      setErrors({ ...errors, email: "E-mail inválido" });
      setUser({ ...user, email: "" });
    }
  };

  const setPassword = (value) => {
    if (value) {
      setErrors({ ...errors, password: undefined });
      setUser({ ...user, password: value });
    } else {
      setErrors({ ...errors, password: "Senha inválido" });
      setUser({ ...user, password: "" });
    }
  };

  const login = async () => {
    if (!loading) {
      setLoading(true);

      if (!user.email || !user.password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: !user.email ? "E-mail é obrigatório" : undefined,
          password: !user.password ? "Senha é obrigatória" : undefined,
        }));
      } else {
        try {
          const response = await AccountAPI.login(user);

          await setToken(response.data);
          dispatch(signIn(response.data));
        } catch (error) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            invalidCredentials: error.response?.data,
          }));
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    // <DismissKeyboard>
    <View>
      <ImageBackground
        source={require("@/assets/images/background-login.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <MaterialCommunityIcons
            style={styles.qrCode}
            name="qrcode"
            size={100}
            color="black"
          />
          <View>
            <H1 style={styles.h1}>Bem-vindo</H1>
            <H3 style={styles.h2}>Entre na sua conta</H3>
          </View>

          <View>
            <Input
              value={user.email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email"
              error={errors.email}
            ></Input>
            <InputPassword
              value={user.password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Senha"
              error={errors.password}
            ></InputPassword>
          </View>

          <ButtonLoading loading={loading} onPress={login}>
            Login
          </ButtonLoading>

          <H3 style={styles.h3}>
            Não tem conta?{" "}
            <Text
              style={styles.register}
              onPress={() => navigation.navigate("register")}
            >
              Faça uma!
            </Text>
          </H3>
        </View>
      </ImageBackground>
    </View>
    // </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    padding: 16,
    display: "flex",
    gap: 32,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "transparent",
  },
  backgroundImage: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "#FFF",
  },
  h1: {
    alignSelf: "center",
  },
  h2: {
    alignSelf: "center",
    fontWeight: "normal",
  },
  h3: {
    alignSelf: "center",
    fontWeight: "normal",
  },

  register: {
    color: primaryColor,
  },
  qrCode: {
    alignSelf: "center",
  },
});
