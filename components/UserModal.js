import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";

const UserModal = ({ modalUsers, onCreatedUser, onCloseModal, userInfo }) => {
  const [userData, setUserData] = useState({ name: "", job: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) return;
    const firstName = userInfo.first_name;
    setUserData({ name: firstName ? firstName : userInfo.name, job: "" });
  }, [userInfo]);

  const updateUserInfohandler = (key, value) => {
    const copyData = { ...userData };
    copyData[key] = value;

    setUserData(copyData);
  };

  const createUserHandler = async () => {
    setIsLoading(true);
    try {
      const url = userInfo
        ? `https://reqres.in/api/users/${userInfo.id}`
        : "https://reqres.in/api/users";
      const res = await fetch(url, {
        method: userInfo ? "PATCH" : "POST",
        body: JSON.stringify(userData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("res--", res);
      console.log("url---", url);

      const data = await res.json();
      console.log("res data create user", data);

      if (userInfo) {
        // updating user
        onCreatedUser({ ...userData, id: userInfo.id });
      } else {
        //createing new user
        onCreatedUser(data);
      }

      setUserData({ name: "", job: "" });
      setIsLoading(false);
    } catch (err) {
      console.log("err while create user", err);
    }
  };

  return (
    <Modal visible={modalUsers}>
      <SafeAreaView
        style={{ justifyContent: "center", flex: 1, paddingHorizontal: 20 }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={styles.txtClose}>
            {userInfo ? "Update User" : "New User"}
          </Text>
        </View>
        <View
          style={{
            padding: 30,
            marginTop: 20,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#ccc",
            elevation: 3,
          }}
        >
          <TextInput
            style={styles.textInput}
            placeholder={"Please enter your Full Name"}
            value={userData.name}
            editable={!isLoading}
            onChangeText={(text) => {
              updateUserInfohandler("name", text);
            }}
          />

          <TextInput
            style={styles.textInput}
            placeholder={"Please enter you Profession"}
            value={userData.job}
            editable={!isLoading}
            onChangeText={(text) => {
              updateUserInfohandler("job", text);
            }}
          />

          <View style={styles.btnContainer}>
            <View style={{ marginRight: 20 }}>
              <Button
                disabled={isLoading}
                title="cancle"
                color="red"
                onPress={() => {
                  setUserData({ name: "", job: "" });
                  onCloseModal();
                }}
              />
            </View>
            <View>
              <Button
                disabled={isLoading}
                title="Create"
                onPress={createUserHandler}
              />
            </View>
          </View>
        </View>
        {isLoading && <ActivityIndicator />}
      </SafeAreaView>
    </Modal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  txtClose: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#bbb",
    marginBottom: 10,
    borderRadius: 5,
  },
});
