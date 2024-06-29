import { StyleSheet, Text, View } from "react-native";
import React from "react";
import * as DropDownMenu from "zeego/dropdown-menu";
import Colors from "@/constants/Colors";

export type HeaderDropDownProps = {
  title: string;
  selected?: string;
  onSelect: (key: string) => void;
  items: Array<{ key: string; title: string, icon:string }>;
};

const HeaderDropDown = ({
  title,
  selected,
  onSelect,
  items,
}: HeaderDropDownProps) => {
  return (
    <DropDownMenu.Root>
      <DropDownMenu.Trigger>
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            {selected && (<Text style={styles.versionText}>{selected} &gt;</Text>)}
        </View>
        
      </DropDownMenu.Trigger>
      <DropDownMenu.Content
        loop={false}
        side="bottom"
        align="start"
        alignOffset={0}
        avoidCollisions={false}
        collisionPadding={8}
        sideOffset={0}
      >
        {items.map((item) => (
          <DropDownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            <DropDownMenu.ItemTitle>{item.title}</DropDownMenu.ItemTitle>
            <DropDownMenu.ItemIcon
                ios={{
                    name: item.icon,
                    pointSize: 20,
                }}
                androidIconName={item.icon}
            />
          </DropDownMenu.Item>
        ))}
      </DropDownMenu.Content>
    </DropDownMenu.Root>
  );
};

export default HeaderDropDown;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  versionText: {
    marginLeft:10,
    color: Colors.greyLight,
    fontWeight:'500',
    fontSize: 16,
  }
});
