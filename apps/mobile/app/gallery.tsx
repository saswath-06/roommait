import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Gallery() {
  const categories = [
    { name: 'Desks', icon: 'desk', count: 24, color: '#dbeafe', iconColor: '#10c0df' },
    { name: 'Chairs', icon: 'chair-rolling', count: 18, color: '#f3e8ff', iconColor: '#9333ea' },
    { name: 'Storage', icon: 'archive-outline', count: 32, color: '#dcfce7', iconColor: '#16a34a' },
    { name: 'Lighting', icon: 'lightbulb-outline', count: 15, color: '#fef3c7', iconColor: '#d97706' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color="#ffffff" />
            <Text style={styles.searchText}>Search furniture...</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <MaterialCommunityIcons 
                    name={category.icon as any} 
                    size={24} 
                    color={category.iconColor} 
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} items</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Items */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Student Favorites</Text>
          
          <View style={styles.featuredCard}>
            <View style={[styles.featuredIcon, { backgroundColor: '#fef3c7' }]}>
              <MaterialCommunityIcons name="desk" size={24} color="#d97706" />
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Compact Study Desk</Text>
              <Text style={styles.featuredDescription}>Perfect for small dorm rooms</Text>
              <Text style={styles.featuredPrice}>$89.99</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View AR</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredCard}>
            <View style={[styles.featuredIcon, { backgroundColor: '#dcfce7' }]}>
              <MaterialCommunityIcons name="chair-rolling" size={24} color="#16a34a" />
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Ergonomic Study Chair</Text>
              <Text style={styles.featuredDescription}>Comfortable for long study sessions</Text>
              <Text style={styles.featuredPrice}>$129.99</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View AR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  searchText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    marginLeft: 12,
    flex: 1,
  },
  categoriesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
  },
  featuredSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuredCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 16,
    fontFamily: 'Fraunces-Bold',
    color: '#10c0df',
  },
  viewButton: {
    backgroundColor: '#10c0df',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Fraunces-SemiBold',
  },
});