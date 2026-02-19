/**
 * Data Recipes - Lists, filtering, and data display patterns
 */

import { Recipe } from "./types.js";

export const dataRecipes: Record<string, Recipe> = {
  "data-list": {
    name: "Data List",
    description: "Scrollable list with loading states and pull-to-refresh",
    category: "data",
    difficulty: "beginner",
    packages: ["@idealyst/components"],
    code: `import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Card, List, ActivityIndicator } from '@idealyst/components';

interface Item {
  id: string;
  title: string;
  description: string;
}

export function DataList() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    // Simulated API call
    const response = await fetch('/api/items');
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchData();
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="lg" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {items.length === 0 ? (
        <View style={{ padding: 32, alignItems: 'center' }}>
          <Text typography="body1" color="tertiary">No items found</Text>
        </View>
      ) : (
        items.map((item) => (
          <Card key={item.id} style={{ margin: 8 }}>
            <Text typography="subtitle1" weight="semibold">{item.title}</Text>
            <Text typography="body2" color="secondary">{item.description}</Text>
          </Card>
        ))
      )}
    </View>
  );
}`,
    explanation: `Data list with:
- Loading state with ActivityIndicator
- Empty state handling
- Card-based list items with proper typography
- Uses only @idealyst/components (no react-native imports)`,
    tips: [
      "Use the List component for virtualized rendering of large datasets",
      "Consider pagination for large datasets",
      "Add error state handling for failed requests",
    ],
    relatedRecipes: ["search-filter"],
  },

  "search-filter": {
    name: "Search & Filter",
    description: "Search input with real-time filtering and category filters",
    category: "data",
    difficulty: "intermediate",
    packages: ["@idealyst/components"],
    code: `import React, { useState, useMemo } from 'react';
import { View, TextInput, Chip, Text, Card, Icon } from '@idealyst/components';

interface Item {
  id: string;
  title: string;
  category: string;
}

const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home'];

export function SearchFilter({ items }: { items: Item[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 12 }}>
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </View>
      </View>

      <View style={{ padding: 16, gap: 8 }}>
        <Text typography="caption" color="tertiary">
          {filteredItems.length} results
        </Text>

        {filteredItems.map((item) => (
          <Card key={item.id}>
            <Text typography="body1">{item.title}</Text>
            <Chip label={item.category} size="sm" />
          </Card>
        ))}
      </View>
    </View>
  );
}`,
    explanation: `Search and filter functionality:
- Real-time search with TextInput
- Category filter chips
- Combined filtering with useMemo for performance
- Results count display`,
    tips: [
      "Debounce search input for API calls",
      "Consider fuzzy matching for better search results",
      "Save filter state for persistence across navigation",
    ],
    relatedRecipes: ["data-list"],
  },
};
