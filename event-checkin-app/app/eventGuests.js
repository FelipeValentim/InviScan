import Loading from "@/components/Loading";
import { primaryColor } from "@/constants/Default";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";

function EventGuests({ guests, route, navigation }) {
  return (
    <View style={styles.container}>
      {!guests ? (
        <Loading color={primaryColor} size={36} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
          {guests.map(({ id, name, photo, dateCheckin }) => (
            <Pressable
              key={id}
              // onPress={() =>
              //   navigation.navigate(routes.event, { eventId: event.id })
              // }
            >
              <View style={styles.card}>
                <View style={styles.guest}>
                  <Image
                    style={styles.photo}
                    source={{
                      uri: photo,
                    }}
                  />
                  <Text style={styles.name}>{name}</Text>
                  {dateCheckin ? (
                    <Text style={styles.checkin}>checkin</Text>
                  ) : (
                    <Text style={styles.notCheckin}>checkin</Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

export default EventGuests;