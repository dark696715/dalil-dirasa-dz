import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import {
  externalResources,
  isAllowedResourceUrl,
  resourceTypes,
  stages,
  type ExternalResource,
  type ResourceType,
  type Stage,
} from "./data/external-resources";

const BRAND = { navy: "#123B7A", green: "#168A68", gold: "#E8B84A", bg: "#F7F9FC", ink: "#172033", muted: "#6C7890", border: "#E4E9F2", white: "#FFFFFF" };
const FAVORITES_KEY = "dalil-study-favorites-v1";
type Screen = { name: "home" } | { name: "browser"; resource: ExternalResource };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [selectedStage, setSelectedStage] = useState<Stage>("الكل");
  const [selectedType, setSelectedType] = useState<ResourceType | "الكل">("الكل");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY).then((raw) => {
      if (raw) setFavorites(JSON.parse(raw) as string[]);
    }).catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return externalResources.filter((item) => {
      const matchesStage = selectedStage === "الكل" || item.stage === selectedStage;
      const matchesType = selectedType === "الكل" || item.type === selectedType;
      const matchesFavorite = !showFavorites || favorites.includes(item.id);
      const matchesQuery = !normalized || [item.title, item.source, item.subject, item.grade, item.type].join(" ").toLowerCase().includes(normalized);
      return matchesStage && matchesType && matchesFavorite && matchesQuery;
    });
  }, [favorites, query, selectedStage, selectedType, showFavorites]);

  const toggleFavorite = async (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((value) => value !== id) : [...favorites, id];
    setFavorites(next);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  if (screen.name === "browser") return <EmbeddedBrowser resource={screen.resource} onBack={() => setScreen({ name: "home" })} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<>
          <View style={styles.headerRow}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>د</Text></View>
            <View style={styles.headerCopy}><Text style={styles.eyebrow}>دليل تعليمي جزائري</Text><Text style={styles.title}>تعلّم من مكان واحد</Text></View>
            <Pressable style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]} onPress={() => setShowFavorites((value) => !value)}><Text style={styles.favoriteButtonText}>{showFavorites ? "الكل" : "محفوظ"}</Text></Pressable>
          </View>
          <View style={styles.heroCard}><View style={styles.heroAccent} /><Text style={styles.heroTitle}>مصادر الدراسة الجزائرية</Text><Text style={styles.heroText}>تصفح الدروس والكتب والتمارين والفيديوهات والأدوات حسب طورك الدراسي، وافتحها داخل التطبيق من مصدرها الأصلي.</Text><View style={styles.heroStats}><Text style={styles.heroStat}>{externalResources.length} موردًا مفهرسًا</Text><Text style={styles.heroDot}>•</Text><Text style={styles.heroStat}>3 أطوار</Text></View></View>
          <TextInput value={query} onChangeText={setQuery} placeholder="ابحث عن مادة، درس أو مصدر..." placeholderTextColor={BRAND.muted} style={styles.search} textAlign="right" />
          <Text style={styles.sectionTitle}>اختر الطور</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stageScroll}>
            <Pressable style={[styles.stageChip, selectedStage === "الكل" && styles.stageChipActive]} onPress={() => setSelectedStage("الكل")}><Text style={[styles.stageChipText, selectedStage === "الكل" && styles.stageChipTextActive]}>الكل</Text></Pressable>
            {stages.map((stage) => <Pressable key={stage.label} style={[styles.stageChip, selectedStage === stage.label && { backgroundColor: stage.color, borderColor: stage.color }]} onPress={() => setSelectedStage(stage.label)}><Text style={[styles.stageNumber, selectedStage === stage.label && styles.whiteText]}>{stage.icon}</Text><Text style={[styles.stageChipText, selectedStage === stage.label && styles.whiteText]}>{stage.label}</Text></Pressable>)}
          </ScrollView>
          <Text style={styles.sectionTitle}>نوع المورد</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeScroll}>
            <Pressable style={[styles.typeChip, selectedType === "الكل" && styles.typeChipActive]} onPress={() => setSelectedType("الكل")}><Text style={[styles.typeText, selectedType === "الكل" && styles.typeTextActive]}>الكل</Text></Pressable>
            {resourceTypes.map((type) => <Pressable key={type} style={[styles.typeChip, selectedType === type && styles.typeChipActive]} onPress={() => setSelectedType(type)}><Text style={[styles.typeText, selectedType === type && styles.typeTextActive]}>{type}</Text></Pressable>)}
          </ScrollView>
          <View style={styles.resultsRow}><Text style={styles.resultsCount}>{filtered.length} مورد</Text><Text style={styles.sectionTitleSmall}>{showFavorites ? "المفضلة" : selectedStage === "الكل" ? "أحدث الفهارس" : selectedStage}</Text></View>
        </>}
        renderItem={({ item }) => <ResourceCard item={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} onOpen={() => setScreen({ name: "browser", resource: item })} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>لا توجد نتائج مطابقة</Text><Text style={styles.emptyText}>جرّب تغيير الطور أو نوع المورد أو كلمة البحث.</Text></View>}
      />
    </SafeAreaView>
  );
}

function ResourceCard({ item, favorite, onFavorite, onOpen }: { item: ExternalResource; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  return <View style={styles.card}><View style={[styles.cardStripe, { backgroundColor: item.color }]} /><View style={styles.cardMain}><View style={styles.cardTop}><View style={[styles.typeBadge, { backgroundColor: `${item.color}15` }]}><Text style={[styles.typeBadgeText, { color: item.color }]}>{item.type}</Text></View><Pressable onPress={onFavorite} hitSlop={12}><Text style={[styles.star, favorite && styles.starActive]}>{favorite ? "★" : "☆"}</Text></Pressable></View><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.cardSource}>{item.source}</Text><Text style={styles.cardDescription}>{item.description}</Text><View style={styles.metaRow}><Text style={styles.meta}>{item.stage}</Text><Text style={styles.meta}>{item.grade}</Text><Text style={styles.meta}>{item.subject}</Text></View><Pressable style={({ pressed }) => [styles.openButton, { backgroundColor: item.color }, pressed && styles.pressed]} onPress={onOpen}><Text style={styles.openButtonText}>فتح داخل التطبيق  ←</Text></Pressable></View></View>;
}

function EmbeddedBrowser({ resource, onBack }: { resource: ExternalResource; onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const valid = isAllowedResourceUrl(resource.url);
  return <SafeAreaView style={styles.safe}><StatusBar style="dark" /><View style={styles.browserHeader}><Pressable onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><Text style={styles.backText}>رجوع</Text></Pressable><View style={styles.browserTitleWrap}><Text style={styles.browserTitle} numberOfLines={1}>{resource.title}</Text><Text style={styles.browserSource}>{resource.source}</Text></View><View style={styles.lock}><Text style={styles.lockText}>داخل التطبيق</Text></View></View>{!valid || failed ? <View style={styles.browserMessage}><Text style={styles.messageIcon}>↗</Text><Text style={styles.messageTitle}>{!valid ? "الرابط غير معتمد" : "تعذر تحميل الصفحة"}</Text><Text style={styles.messageText}>{!valid ? "هذا الرابط خارج قائمة المصادر المعتمدة." : "قد يكون الموقع غير متاح أو يمنع التضمين داخل التطبيقات."}</Text><Pressable onPress={onBack} style={styles.messageButton}><Text style={styles.messageButtonText}>العودة إلى الفهرس</Text></Pressable></View> : Platform.OS === "web" ? <View style={styles.browserMessage}><Text style={styles.messageIcon}>◫</Text><Text style={styles.messageTitle}>المتصفح المضمّن متاح على Android</Text><Text style={styles.messageText}>نسخة Android تفتح المصدر داخل WebView. هذه المعاينة لا تشغّل WebView على الويب.</Text></View> : <View style={styles.webViewWrap}><WebView source={{ uri: resource.url }} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} onError={() => { setLoading(false); setFailed(true); }} startInLoadingState javaScriptEnabled domStorageEnabled setSupportMultipleWindows={false} onShouldStartLoadWithRequest={(request) => isAllowedResourceUrl(request.url)} /><View pointerEvents="none" style={styles.sourcePill}><Text style={styles.sourcePillText}>{resource.source}</Text></View>{loading && <View pointerEvents="none" style={styles.loading}><ActivityIndicator color={BRAND.navy} /><Text style={styles.loadingText}>جارٍ فتح المصدر...</Text></View>}</View>}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BRAND.bg }, content: { padding: 18, paddingBottom: 36 }, headerRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, marginBottom: 18 }, headerCopy: { flex: 1, alignItems: "flex-end" }, brandMark: { width: 48, height: 48, borderRadius: 16, backgroundColor: BRAND.navy, alignItems: "center", justifyContent: "center" }, brandMarkText: { color: BRAND.white, fontSize: 26, fontWeight: "800" }, eyebrow: { color: BRAND.green, fontSize: 12, fontWeight: "700", marginBottom: 2 }, title: { color: BRAND.ink, fontSize: 22, fontWeight: "800" }, favoriteButton: { borderWidth: 1, borderColor: BRAND.border, backgroundColor: BRAND.white, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 }, favoriteButtonText: { color: BRAND.navy, fontWeight: "700", fontSize: 12 }, heroCard: { backgroundColor: BRAND.navy, borderRadius: 24, padding: 20, marginBottom: 16, overflow: "hidden" }, heroAccent: { position: "absolute", width: 130, height: 130, borderRadius: 65, backgroundColor: "#28569A", left: -35, top: -45, opacity: 0.65 }, heroTitle: { color: BRAND.white, fontSize: 22, fontWeight: "800", textAlign: "right", marginBottom: 8 }, heroText: { color: "#DCE8FA", fontSize: 14, lineHeight: 23, textAlign: "right" }, heroStats: { flexDirection: "row-reverse", alignItems: "center", gap: 10, marginTop: 15 }, heroStat: { color: BRAND.gold, fontWeight: "800", fontSize: 12 }, heroDot: { color: "#9EB8DD" }, search: { height: 52, backgroundColor: BRAND.white, borderWidth: 1, borderColor: BRAND.border, borderRadius: 16, paddingHorizontal: 16, color: BRAND.ink, fontSize: 14, marginBottom: 22 }, sectionTitle: { color: BRAND.ink, fontSize: 16, fontWeight: "800", textAlign: "right", marginBottom: 10 }, stageScroll: { gap: 10, paddingBottom: 20 }, stageChip: { minWidth: 104, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 7, borderWidth: 1, borderColor: BRAND.border, backgroundColor: BRAND.white, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 11 }, stageChipActive: { backgroundColor: BRAND.navy, borderColor: BRAND.navy }, stageNumber: { color: BRAND.muted, fontSize: 10, fontWeight: "900" }, stageChipText: { color: BRAND.ink, fontWeight: "700", fontSize: 13 }, stageChipTextActive: { color: BRAND.white }, whiteText: { color: BRAND.white }, typeScroll: { gap: 8, paddingBottom: 18 }, typeChip: { borderWidth: 1, borderColor: BRAND.border, backgroundColor: BRAND.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 }, typeChipActive: { backgroundColor: BRAND.green, borderColor: BRAND.green }, typeText: { color: BRAND.muted, fontSize: 12, fontWeight: "700" }, typeTextActive: { color: BRAND.white }, resultsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }, sectionTitleSmall: { color: BRAND.ink, fontSize: 18, fontWeight: "800" }, resultsCount: { color: BRAND.muted, fontSize: 12 }, card: { flexDirection: "row-reverse", backgroundColor: BRAND.white, borderRadius: 18, marginBottom: 12, overflow: "hidden", borderWidth: 1, borderColor: BRAND.border }, cardStripe: { width: 5 }, cardMain: { flex: 1, padding: 15 }, cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, typeBadge: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 }, typeBadgeText: { fontWeight: "800", fontSize: 11 }, star: { color: "#AAB4C5", fontSize: 25, lineHeight: 25 }, starActive: { color: BRAND.gold }, cardTitle: { color: BRAND.ink, fontSize: 17, fontWeight: "800", textAlign: "right", marginTop: 9 }, cardSource: { color: BRAND.green, fontSize: 12, fontWeight: "700", textAlign: "right", marginTop: 4 }, cardDescription: { color: BRAND.muted, fontSize: 12, lineHeight: 19, textAlign: "right", marginTop: 6 }, metaRow: { flexDirection: "row-reverse", gap: 6, marginTop: 10, flexWrap: "wrap" }, meta: { color: BRAND.muted, fontSize: 10, backgroundColor: BRAND.bg, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 4 }, openButton: { alignSelf: "stretch", borderRadius: 11, paddingVertical: 11, alignItems: "center", marginTop: 13 }, openButtonText: { color: BRAND.white, fontSize: 12, fontWeight: "800" }, pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] }, empty: { alignItems: "center", paddingVertical: 50 }, emptyTitle: { color: BRAND.ink, fontSize: 17, fontWeight: "800" }, emptyText: { color: BRAND.muted, fontSize: 13, marginTop: 8 }, browserHeader: { flexDirection: "row-reverse", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: BRAND.white, borderBottomWidth: 1, borderBottomColor: BRAND.border }, backButton: { backgroundColor: "#EEF3FA", borderRadius: 10, paddingHorizontal: 11, paddingVertical: 9 }, backText: { color: BRAND.navy, fontWeight: "800", fontSize: 12 }, browserTitleWrap: { flex: 1, alignItems: "flex-end" }, browserTitle: { color: BRAND.ink, fontWeight: "800", fontSize: 14 }, browserSource: { color: BRAND.green, fontSize: 10, marginTop: 2 }, lock: { borderRadius: 8, backgroundColor: "#EDF8F3", paddingHorizontal: 8, paddingVertical: 6 }, lockText: { color: BRAND.green, fontSize: 9, fontWeight: "800" }, webViewWrap: { flex: 1, position: "relative" }, loading: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(247,249,252,0.92)", alignItems: "center", justifyContent: "center", gap: 10 }, loadingText: { color: BRAND.navy, fontWeight: "700" }, sourcePill: { position: "absolute", bottom: 15, alignSelf: "center", backgroundColor: "rgba(18,59,122,0.9)", borderRadius: 15, paddingHorizontal: 12, paddingVertical: 7 }, sourcePillText: { color: BRAND.white, fontSize: 10, fontWeight: "700" }, browserMessage: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 }, messageIcon: { color: BRAND.gold, fontSize: 40, marginBottom: 15 }, messageTitle: { color: BRAND.ink, fontSize: 20, fontWeight: "800", textAlign: "center" }, messageText: { color: BRAND.muted, fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 10, maxWidth: 320 }, messageButton: { backgroundColor: BRAND.navy, borderRadius: 13, paddingHorizontal: 18, paddingVertical: 12, marginTop: 20 }, messageButtonText: { color: BRAND.white, fontWeight: "800" },
});
