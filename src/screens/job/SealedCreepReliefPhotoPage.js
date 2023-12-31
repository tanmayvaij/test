import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { height, unitH, width } from "../../utils/constant";
import Text from "../../components/Text";
import { TextType } from "../../theme/typography";
import EcomHelper from "../../utils/ecomHelper";
import { AppContext } from "../../context/AppContext";

import * as ExpoImagePicker from "expo-image-picker";

export default function SealedCreepReliefPhotoPage() {

  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const meterDetails = appContext.meterDetails;
  let streamImages = meterDetails?.streamImages;
  let count = appContext.streamCounter;

  const [selectedImage, setSelectedImage] = useState();
  console.log("SealedCreepReliefPhotoPage == COUNT", count);

  useEffect(() => {
    const creepReliefPhoto =
      streamImages != null
        ? Object.entries(streamImages).find(
            ([key]) => key === `creepReliefPhoto_${count}`
          )
        : null;
    const photo = creepReliefPhoto ? creepReliefPhoto[1] : null;
    setSelectedImage(photo);
  }, [count, streamImages]);

  const backPressed = () => {
    streamImages = {
      ...streamImages,
      [`creepReliefPhoto_${count}`]: selectedImage,
    };

    appContext.setMeterDetails({
      ...meterDetails,
      streamImages: streamImages,
    });
    navigation.goBack();
  };

  const nextPressed = async () => {
    if (!selectedImage) {
      EcomHelper.showInfoMessage("Please choose image");
      return;
    }

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      appContext.setBlobs(prev => [ ...prev, blob ])
    }
    catch(err) {
      console.log(err);
    }

    console.log("CreepReliefPhotoPage - Count", count);

    streamImages = {
      ...streamImages,
      [`creepReliefPhoto_${count}`]: selectedImage,
    };

    appContext.setMeterDetails({
      ...meterDetails,
      streamImages: streamImages,
    });

    console.log(appContext.meterDetails?.streamImages);
    navigation.navigate("SealedRegulatorPhotoPage");
  };

  const handleImagePicker = () => {
    Alert.alert("Choose Image", "how to choose image ?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Choose from gallery",
        onPress: chooseFromGallery,
      },
      {
        text: "Take photo",
        onPress: takePhoto,
      },
      {},
    ]);
  };
  const takePhoto = () => {
    const options = {
      title: "Take Photo",
      mediaType: "photo",
      quality: 1,
    };

    ExpoImagePicker.launchCameraAsync(options)
      .then((response) => {
        setSelectedImage(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const chooseFromGallery = () => {
    const options = {
      title: "Choose from Gallery",
      mediaType: "photo",
      quality: 1,
    };

    ExpoImagePicker.launchImageLibraryAsync(options)
      .then((response) => {
        setSelectedImage(response.assets[0].uri);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.content}>
        <Header
          hasLeftBtn={true}
          hasCenterText={true}
          hasRightBtn={true}
          centerText={"Photo of Creep Relief"}
          leftBtnPressed={backPressed}
          rightBtnPressed={nextPressed}
        />
        <View style={styles.body}>
          <View style={styles.spacer} />
          <Text type={TextType.TEXTINPUT} style={{ borderWidth: 0 }}>
            {"Stream " + (count + 1)}
          </Text>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <View style={styles.row}>
            <Button
              title={
                selectedImage === undefined ? "Choose Image" : "Change Image"
              }
              onPress={handleImagePicker}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: width,
    height: height,
  },
  body: {
    marginHorizontal: width * 0.1,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  spacer: {
    height: unitH * 50,
  },
});
