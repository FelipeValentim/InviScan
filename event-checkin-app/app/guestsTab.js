import Loading from "@/components/Loading";
import {
  backgroundColor,
  primaryColor,
  redColor,
  routes,
} from "@/constants/Default";
import { GuestAPI } from "@/services/GuestAPI";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

function GuestsTab({ updateUncheckin, updateCheckin, guests, navigation }) {
  const [loading, setLoading] = useState(false);

  const uncheckin = async (id) => {
    try {
      if (!loading) {
        setLoading(true);
        await GuestAPI.uncheckin(id);
        updateUncheckin(id);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status == httpStatus.conflict) {
          updateUncheckin(id);
        } else {
          console.log(response.data);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return !guests ? (
    <Loading color={primaryColor} size={36} />
  ) : (
    <View style={styles.container}>
      <SwipeListView
        contentContainerStyle={{ paddingBottom: 50 }}
        data={guests}
        renderItem={({ item }, rowMap) => (
          <Pressable
            key={item.id}
            onPress={() => {
              navigation.navigate(routes.guest, {
                guest: item,
                updateCheckin,
                updateUncheckin,
              });
            }}
          >
            <View style={styles.card}>
              <View style={styles.guest}>
                <Image
                  style={styles.photo}
                  source={{
                    uri: item.photo,
                  }}
                />
                <Text style={styles.name}>{item.name}</Text>
                {item.checkin ? (
                  <Text style={styles.checkin}>checkin</Text>
                ) : (
                  <Text style={styles.notCheckin}>checkin</Text>
                )}
              </View>
            </View>
          </Pressable>
        )}
        renderHiddenItem={({ item }, rowMap) =>
          item.checkin && (
            <Pressable
              onPress={() => uncheckin(item.id)}
              style={styles.swipeHiddenContainer}
            >
              <View style={styles.swipeHiddenItem}>
                <Ionicons name="arrow-undo" size={30} color={redColor} />
                <Text>Uncheckin</Text>
              </View>
            </Pressable>
          )
        }
        leftOpenValue={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: backgroundColor },
  card: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 20,
  },
  guest: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  swipeHiddenContainer: {
    margin: 10,
    borderRadius: 20,
    // backgroundColor: "red",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  swipeHiddenItem: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
    display: "flex",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    fontWeight: "bold",
    flex: 1,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  checkin: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    backgroundColor: primaryColor,
    padding: 5,
    borderRadius: 10,
    color: "#FFF",
  },
  notCheckin: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    backgroundColor: "#ccc",
    padding: 5,
    borderRadius: 10,
    color: "#FFF",
  },
});

export default GuestsTab;
