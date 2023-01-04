import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import UserModal from "./components/UserModal";

export default function App() {
  const [users, setUsers] = useState([]);
  const [modalUsers, setModalUsers] = useState(false);
  const [activeUserData, setActiveUserData] = useState();

  useEffect(() => {
    if (modalUsers) return;
    setActiveUserData(null);
  }, [modalUsers]);

  useEffect(() => {
    getListUsers();
  }, []);
  const getListUsers = () => {
    fetch("https://reqres.in/api/users", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUsers(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = async (item) => {
    try {
      const res = fetch(`https://reqres.in/api/users/${item.id}`, {
        method: "DELETE",
      });

      // const data = await res.json();
      // console.log("res data delete user", data);

      const updatedData = users.filter((user) => user.id !== item.id);
      setUsers(updatedData);
    } catch (err) {
      console.log("err while create user", err);
    }
  };

  const onCreatedUser = (user) => {
    if (!user) return;

    if (user && users.find((item) => item.id === user.id)) {
      const updatedData = [];
      users.map((item) => {
        if (item.id === user.id) {
          // update and push
          updatedData.push({ ...item, first_name: user.name, id: user.id });
        } else {
          // just push
          updatedData.push(item);
        }
      });

      setUsers(updatedData);
    } else {
      setUsers((prevState) =>
        prevState.length > 0 ? [user, ...prevState] : [user]
      );
    }

    setModalUsers(false);
  };

  const editUserHandler = (user) => {
    setActiveUserData(user);
    setModalUsers(true);
  };

  return (
    <SafeAreaView style={{ position: "relative" }}>
      <UserModal
        modalUsers={modalUsers}
        onCreatedUser={onCreatedUser}
        onCloseModal={() => setModalUsers(false)}
        userInfo={activeUserData}
      />

      <View style={styles.header}>
        <Text style={styles.txtMain}>Contact List {users.length}</Text>
        {/* <TouchableOpacity style={{ padding: 10 }} onPress={handleCreate}>
          <Text>New</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView>
        <View style={styles.contactListContainer}>
          {users.map((item, index) => {
            return (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.item}>
                  <Image
                    source={{
                      uri: item.avatar
                        ? item.avatar
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
                    }}
                    style={{ width: 55, height: 55 }}
                  />
                  <Text>{item.index}</Text>
                  <Text style={styles.txtName}>
                    {item.first_name
                      ? `${item.first_name}-${item.last_name}`
                      : item.name}
                  </Text>
                  <Text style={styles.txtNormal}>{item.email}</Text>
                </View>
                <View>
                  <TouchableOpacity onPress={() => handleRemove(item.id)}>
                    <Text style={styles.txtDelete}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => editUserHandler(item)}>
                    <Text style={styles.txtDelete}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.btn} onPress={() => setModalUsers(true)}>
        <Text style={styles.btnText}>Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "purple",
    justifyContent: "center",
    alignContent: "center",
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    position: "absolute",
    bottom: 70,
    right: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
    backgroundColor: "purple",
    elevation: 3,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  contactListContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginBottom: 100,
  },

  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
  },
  txtMain: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 5,
  },
  item: {},
  txtName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  txtNormal: {
    fontSize: 14,
    color: "#444",
  },
  txtDelete: {
    color: "red",
  },
  txtClose: {
    color: "gray",
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#888",
    marginBottom: 10,
  },
  btnContainer: {
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "black",
    padding: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
