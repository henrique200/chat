import React, { useState, useRef } from "react";

import {
  Modal,
  Alert,
  SafeAreaView,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  FlatList,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { Ionicons, AntDesign } from "@expo/vector-icons";

interface Message {
  id: number;
  text: string;
  user: "human" | "bot";
  deleted?: boolean;
  type?: "text" | "image";
  content?: any;
  timestamp: Date; // Adicionado timestamp aqui
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const flatListRef = useRef(null);

  const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSendMessage = (imageUri: string | null) => {
    if (currentMessage.length === 0 && !imageUri) {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Math.random(),
        text: currentMessage,
        user: "human",
        content: imageUri,
        timestamp: new Date(),
        type: imageUri ? "image" : "text",
      },
      {
        id: Math.random(),
        text: "Mensagem Automática",
        user: "bot",
        content: null,
        timestamp: new Date(),
      },
    ]);

    setCurrentMessage("");
    setModalVisible(false);
    setPreviewImage(null);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleRemoveMessage = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === id ? { ...message, deleted: true } : message
      )
    );
  };

  const handleUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // O campo "assets" é um array, então deve-se pegar o primeiro item
      let firstAsset = result.assets[0];
      setPreviewImage(firstAsset.uri);
      setModalVisible(true);
    }
  };

  const RenderMessage = ({ item }) => {
    const handleLongPress = () => {
      if (item.user !== "human") return;
      if (item.deleted) {
        Alert.alert(
          "Erro",
          "Esta mensagem já foi apagada pelo seu remetente e não pode ser apagada novamente."
        );
        return;
      }
      Alert.alert(
        "Selecione uma ação",
        "Deseja realmente apagar esta mensagem?",
        [
          { text: "Apagar", onPress: () => handleRemoveMessage(item.id) },
          { text: "Cancelar", style: "cancel" },
        ]
      );
    };

    if (item.type === "image") {
      return (
        <TouchableOpacity
          key={item.id}
          onLongPress={handleLongPress}
          className={`
                  max-w-[256px] 
                  ${
                    item.user === "human"
                      ? "rounded-custom1"
                      : "rounded-custom2"
                  }
                  border border-[#d1d1d1] 
                 ${item.user === "human" ? "bg-green-700" : "bg-gray-500"} 
                  p-2 
                  mb-2.5 
                  opacity-${item.user === "human" ? "100" : "60"} 
                  ${item.user === "human" ? "self-end" : "self-start"}
                  ${item.user === "human" ? "items-end" : "items-start"}
                  ${item.user === "human" ? "ml-[50%]" : "ml-0"}
                  ${item.user === "human" ? "mr-0" : "mr-[50%]"}
          `}
        >
          {!item.deleted ? (
            <>
              <Image
                source={{ uri: item.content }}
                className="w-36 h-36 rounded-2xl mb-3"
                resizeMode="cover"
              />
              <Text className="text-xs text-white font-normal">
                {dateTimeFormat.format(item.timestamp)}
              </Text>
            </>
          ) : (
            <>
              <Text className="text-base text-white font-normal">
                Essa imagem foi apagada
              </Text>
              <Text className="text-xs text-white font-normal">
                {dateTimeFormat.format(item.timestamp)}
              </Text>
            </>
          )}
        </TouchableOpacity>
      );
    } else {
      // handle text message
      return (
        <TouchableOpacity
          key={item.id}
          onLongPress={handleLongPress}
          className={`
                  max-w-[256px] 
                   ${
                     item.user === "human"
                       ? "rounded-custom1"
                       : "rounded-custom2"
                   }
                  border border-[#d1d1d1] 
                 ${item.user === "human" ? "bg-green-700" : "bg-gray-500"} 
                  p-2 
                  mb-2.5 
                  opacity-${item.user === "human" ? "100" : "60"} 
                  ${item.user === "human" ? "self-end" : "self-start"}
                  ${item.user === "human" ? "items-end" : "items-start"}
                  ${item.user === "human" ? "ml-[50%]" : "ml-0"}
                  ${item.user === "human" ? "mr-0" : "mr-[50%]"}
                  
          `}
        >
          <Text className="text-base text-white font-normal">
            {item.deleted ? "Essa mensagem foi apagada" : item.text}
          </Text>
          <Text className="text-xs text-white font-normal">
            {dateTimeFormat.format(item.timestamp)}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView className="flex-1  bg-zinc-700">
      <TouchableWithoutFeedback
        className="flex-1  bg-zinc-700"
        onPress={() => Keyboard.dismiss()}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex-1 flex-col bg-zinc-700 items-center justify-between p-6">
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent
            />
            {/* header */}
            <View className="flex-row w-full h-8 bg-inherit items-center justify-between my-3 ">
              <View className="flex-row items-center justify-start gap-2">
                <View className="w-9 h-9 bg-slate-300 rounded-full" />
                <Text className="text-2xl text-slate-300 font-bold">
                  Fulano de Tal
                </Text>
              </View>

              <TouchableOpacity className="flex-col items-center gap-1">
                <View className="w-1 h-1 bg-slate-300 rounded-full" />
                <View className="w-1 h-1 bg-slate-300 rounded-full" />
                <View className="w-1 h-1 bg-slate-300 rounded-full" />
              </TouchableOpacity>
            </View>

            <FlatList
              className="flex-1 "
              ref={flatListRef}
              data={messages}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <RenderMessage item={item} />}
              showsVerticalScrollIndicator={false}
            />
            {/* Footer */}
            <View className="flex-row w-full items-center justify-between pt-4 gap-3">
              <View className="flex-row w-4/5 items-end justify-between max-h-24 border-[#d1d1d1] border-2 rounded-xl px-3 py-2 ">
                <TextInput
                  multiline
                  placeholder="Digite aqui...."
                  placeholderTextColor="#d1d1d1"
                  value={currentMessage}
                  onChangeText={setCurrentMessage}
                  className="w-4/5 max-h-24 bg-inherit text-slate-300 text-base "
                />
                <TouchableOpacity onPress={handleUpload}>
                  <AntDesign name="upload" size={24} color="#d1d1d1" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="px-3 py-3 bg-slate-500 items-center justify-center rounded-full"
                onPress={() => handleSendMessage(previewImage)}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            {/* preview image */}
            <Modal animationType="slide" visible={modalVisible} transparent>
              <View className="flex-1 flex-col items-center justify-center ">
                <View className="bg-gray-700 rounded-md p-4">
                  <Text className="text-xl font-bold text-white text-center pb-4 ">
                    Deseja realmente enviar essa foto ?
                  </Text>

                  <Image
                    className="w-36 h-36 rounded-lg self-center mb-4"
                    source={{ uri: previewImage }}
                    resizeMode="cover"
                  />

                  <View className=" flex-row items-center justify-between gap-5 pb-1">
                    <TouchableOpacity
                      className=" rounded bg-[#c40000] py-3 px-12 "
                      onPress={() => setModalVisible(false)}
                    >
                      <Text className="text-xs font-bold text-white">Não</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className=" rounded bg-[#002677] py-3 px-12 "
                      onPress={() => handleSendMessage(previewImage)}
                    >
                      <Text className="text-xs font-bold text-white">Sim</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
