export function safeGoBack(navigation, fallbackTab = 'Home') {
  if (!navigation) return;
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }
  navigation.navigate('Tabs', { screen: fallbackTab });
}
