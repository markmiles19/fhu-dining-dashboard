import React from "react";
import { StyleSheet, Text, View } from 'react-native';

type ProgressBarProps = {
  title: string
  percentage: number
  label: string
}

const ProgressBar = ({title, label, percentage}:ProgressBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}></View>
        <Text style={styles.rowTitle}> {title} </Text>
        <Text style={styles.rowPercent}> {percentage} </Text>
    </View>
  );
};

const styles = StyleSheet.create ({
  container: {
    display: "flex",
    padding: 8,
    justifyContent: "flex-start"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 24
  },
  rowTitle: {
    fontSize: 24
  },
  rowPercent: {
    fontSize: 24,
    fontWeight: 800
  },
  track: {
    backgroundColor: "#eee",
    height: 10,
    overflow: "hidden",
    borderRadius: 5
  },
  progress: {
    backgroundColor: "red",
    width: "100%",
    borderRadius: 5
  }
})