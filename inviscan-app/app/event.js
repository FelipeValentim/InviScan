import { primaryColor, screenHeight } from "@/constants/Default";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import React, { useEffect, useState } from "react";
import EventInfoTab from "./eventTab";
import EventGuestsTab from "./guestsTab";
import EventTemplateTab from "./templateTab";
import EventScannerTab from "./eventScanner";
import { Ionicons } from "@expo/vector-icons";
import { EventAPI } from "@/services/EventAPI";
import { getCurrentDateFormatted } from "@/helper/date";

const Tab = createBottomTabNavigator();

export default function EventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [info, setInfo] = useState();
  const [guests, setGuests] = useState();

  useEffect(() => {
    const getData = async () => {
      const { data } = await EventAPI.get(eventId);
      setInfo(data);
      setGuests(data.guests);
    };
    getData();
  }, []);

  const checkin = async (ids) => {
    const newGuests = guests.map((guest) =>
      ids.includes(guest.id)
        ? { ...guest, checkin: getCurrentDateFormatted() }
        : guest
    );
    setGuests(newGuests);
  };

  const updateUncheckin = async (ids) => {
    const newGuests = guests.map((guest) =>
      ids.includes(guest.id) ? { ...guest, checkin: null } : guest
    );

    setGuests(newGuests);
  };

  const updateDeleted = async (ids) => {
    const newGuests = guests.filter((guest) => !ids.includes(guest.id));
    setGuests(newGuests);
  };

  useEffect(() => {
    if (guests) {
      setInfo({
        ...info,
        checkinCount: guests.filter((x) => x.checkin).length,
        dropCount: guests.filter((x) => !x.checkin).length,
      });
    }
  }, [guests]);

  const addGuest = (guest) => {
    setGuests([...guests, { ...guest }]);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: primaryColor,
        tabBarStyle: {
          position: "absolute",
          bottom: 14,
          left: 14,
          right: 14,
          backgroundColor: "#000",
          elevation: 0,
          borderColor: "transparent",
          borderRadius: 10,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="home" size={size} color={color} />
            ) : (
              <Ionicons name="home-outline" size={size} color={color} />
            );
          },
        }}
        name="Informações"
      >
        {(props) => <EventInfoTab {...props} info={info} />}
      </Tab.Screen>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="qr-code" size={size} color={color} />
            ) : (
              <Ionicons name="qr-code-outline" size={size} color={color} />
            );
          },
        }}
        name="Scanner"
      >
        {(props) => (
          <EventScannerTab
            guests={guests}
            updateUncheckin={updateUncheckin}
            updateCheckin={checkin}
            {...props}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="people" size={size} color={color} />
            ) : (
              <Ionicons name="people-outline" size={size} color={color} />
            );
          },
        }}
        name="Convidados"
        initialParams={{ eventId }}
      >
        {(props) => (
          <EventGuestsTab
            {...props}
            guests={guests}
            updateUncheckin={updateUncheckin}
            updateCheckin={checkin}
            updateDeleted={updateDeleted}
            addGuest={addGuest}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="book" size={size} color={color} />
            ) : (
              <Ionicons name="book-outline" size={size} color={color} />
            );
          },
        }}
        name="Template"
        initialParams={{ eventId }}
      >
        {(props) => <EventTemplateTab {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
