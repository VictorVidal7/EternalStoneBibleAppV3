import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import bibleDB from '../../src/lib/database';
import { BibleVerse, ReadingProgress } from '../../src/types/bible';
import { READING_PLANS } from '../../src/constants/reading-plans';

export default function HomeScreen() {
  const router = useRouter();
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [lastRead, setLastRead] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    try {
      await bibleDB.initialize();

      // Get daily verse (random for now, can be improved with actual daily logic)
      const verse = await bibleDB.getRandomVerse();
      setDailyVerse(verse);

      // Get last reading position
      const progress = await bibleDB.getReadingProgress();
      setLastRead(progress);

      setLoading(false);
    } catch (error) {
      console.error('Error loading home data:', error);
      setLoading(false);
    }
  }

  function goToLastRead() {
    if (lastRead) {
      router.push(`/verse/${lastRead.book}/${lastRead.chapter}` as any);
    }
  }

  function goToBook(bookName: string) {
    router.push(`/chapter/${bookName}` as any);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Section */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Bienvenido a Eternal Bible</Text>
        <Text style={styles.welcomeSubtitle}>
          Que la Palabra de Dios ilumine tu día
        </Text>
      </View>

      {/* Daily Verse */}
      {dailyVerse && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sparkles" size={20} color="#F39C12" />
            <Text style={styles.cardTitle}>Versículo del Día</Text>
          </View>

          <Text style={styles.verseText}>"{dailyVerse.text}"</Text>

          <Text style={styles.verseReference}>
            {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
          </Text>

          <TouchableOpacity
            style={styles.verseButton}
            onPress={() => router.push(`/verse/${dailyVerse.book}/${dailyVerse.chapter}` as any)}
          >
            <Text style={styles.verseButtonText}>Leer Capítulo Completo</Text>
            <Ionicons name="arrow-forward" size={16} color="#4A90E2" />
          </TouchableOpacity>
        </View>
      )}

      {/* Continue Reading */}
      {lastRead && (
        <TouchableOpacity style={styles.card} onPress={goToLastRead}>
          <View style={styles.cardHeader}>
            <Ionicons name="book-outline" size={20} color="#27AE60" />
            <Text style={styles.cardTitle}>Continuar Leyendo</Text>
          </View>

          <Text style={styles.continueText}>
            {lastRead.book} {lastRead.chapter}:{lastRead.verse}
          </Text>

          <View style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continuar</Text>
            <Ionicons name="play-circle" size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      )}

      {/* Reading Plans */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={20} color="#9B59B6" />
          <Text style={styles.cardTitle}>Planes de Lectura</Text>
        </View>

        <Text style={styles.sectionDescription}>
          Sigue un plan estructurado para leer la Biblia
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.plansScrollView}
          contentContainerStyle={styles.plansScrollContent}
        >
          {READING_PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, { borderLeftColor: plan.color }]}
              onPress={() => {
                // TODO: Navigate to plan details
                router.push(`/chapter/${plan.days[0].readings[0].book}` as any);
              }}
            >
              <View style={[styles.planIcon, { backgroundColor: plan.color + '20' }]}>
                <Ionicons name={plan.icon as any} size={24} color={plan.color} />
              </View>
              <Text style={styles.planName} numberOfLines={2}>
                {plan.name}
              </Text>
              <Text style={styles.planDuration}>{plan.duration} días</Text>
              <Text style={styles.planDescription} numberOfLines={2}>
                {plan.description}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Access */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="flash" size={20} color="#E74C3C" />
          <Text style={styles.cardTitle}>Acceso Rápido</Text>
        </View>

        <View style={styles.quickAccessGrid}>
          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => goToBook('Génesis')}
          >
            <Ionicons name="star" size={28} color="#3498DB" />
            <Text style={styles.quickAccessText}>Génesis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => goToBook('Salmos')}
          >
            <Ionicons name="musical-notes" size={28} color="#9B59B6" />
            <Text style={styles.quickAccessText}>Salmos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => goToBook('Proverbios')}
          >
            <Ionicons name="bulb" size={28} color="#F39C12" />
            <Text style={styles.quickAccessText}>Proverbios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => goToBook('Juan')}
          >
            <Ionicons name="heart" size={28} color="#E74C3C" />
            <Text style={styles.quickAccessText}>Juan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => goToBook('Romanos')}
          >
            <Ionicons name="book" size={28} color="#1ABC9C" />
            <Text style={styles.quickAccessText}>Romanos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAccessItem}
            onPress={() => goToBook('Apocalipsis')}
          >
            <Ionicons name="flame" size={28} color="#E67E22" />
            <Text style={styles.quickAccessText}>Apocalipsis</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Quote */}
      <View style={styles.footerQuote}>
        <Text style={styles.footerQuoteText}>
          "Tu palabra es verdad" - Juan 17:17
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#ECF0F1',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#34495E',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  verseReference: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 16,
  },
  verseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  verseButtonText: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
    marginRight: 6,
  },
  continueText: {
    fontSize: 20,
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: 16,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 12,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  quickAccessItem: {
    width: '30%',
    margin: '1.66%',
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  quickAccessText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
    lineHeight: 20,
  },
  plansScrollView: {
    marginHorizontal: -20,
    marginBottom: -10,
  },
  plansScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  planCard: {
    width: 200,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderLeftWidth: 4,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
    minHeight: 40,
  },
  planDuration: {
    fontSize: 13,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 13,
    color: '#95A5A6',
    lineHeight: 18,
  },
  footerQuote: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerQuoteText: {
    fontSize: 13,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
});
