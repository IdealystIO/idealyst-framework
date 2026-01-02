import React from 'react';
import { Screen, View, Text, Skeleton, SkeletonGroup, Divider, Card } from '../index';

export const SkeletonExamples = () => {
  return (
    <Screen background="primary" safeArea>
      <View gap="lg" style={{ maxWidth: 800, width: '100%', paddingHorizontal: 16, marginHorizontal: 'auto' }}>
        <Text typography="h3">Skeleton Examples</Text>

        <Divider spacing="md" />
        <Text typography="h5">Basic Shapes</Text>

        <Text typography="subtitle1">Rectangle (Default)</Text>
        <Skeleton width="100%" height={40} shape="rectangle" />

        <Text typography="subtitle1">Rounded</Text>
        <Skeleton width="100%" height={40} shape="rounded" />

        <Text typography="subtitle1">Circle</Text>
        <Skeleton width={64} height={64} shape="circle" />

        <Divider spacing="md" />
        <Text typography="h5">Custom Border Radius</Text>

        <Skeleton width="100%" height={40} shape="rounded" borderRadius={4} />
        <Skeleton width="100%" height={40} shape="rounded" borderRadius={16} />
        <Skeleton width="100%" height={40} shape="rounded" borderRadius={24} />

        <Divider spacing="md" />
        <Text typography="h5">Animation Types</Text>

        <Text typography="subtitle1">Pulse (Default)</Text>
        <Skeleton width="100%" height={40} animation="pulse" />

        <Text typography="subtitle1">Wave</Text>
        <Skeleton width="100%" height={40} animation="wave" />

        <Text typography="subtitle1">None</Text>
        <Skeleton width="100%" height={40} animation="none" />

        <Divider spacing="md" />
        <Text typography="h5">Skeleton Groups</Text>

        <Text typography="subtitle1">Default Group (3 items)</Text>
        <SkeletonGroup />

        <Text typography="subtitle1">Custom Count (5 items)</Text>
        <SkeletonGroup count={5} />

        <Text typography="subtitle1">Custom Spacing</Text>
        <SkeletonGroup count={3} spacing={20} />

        <Text typography="subtitle1">Custom Skeleton Props</Text>
        <SkeletonGroup
          count={4}
          spacing={16}
          skeletonProps={{
            height: 60,
            shape: 'rounded',
            animation: 'wave',
          }}
        />

        <Divider spacing="md" />
        <Text typography="h5">Profile Card Loading</Text>

        <Card type="outlined">
          <View gap="md">
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Skeleton width={64} height={64} shape="circle" />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="60%" height={24} shape="rounded" />
                <Skeleton width="40%" height={16} shape="rounded" />
              </View>
            </View>
            <SkeletonGroup count={3} skeletonProps={{ height: 16, shape: 'rounded' }} />
          </View>
        </Card>

        <Divider spacing="md" />
        <Text typography="h5">Article Card Loading</Text>

        <Card type="outlined">
          <View gap="md">
            <Skeleton width="100%" height={200} shape="rounded" />
            <Skeleton width="80%" height={28} shape="rounded" />
            <SkeletonGroup
              count={3}
              spacing={8}
              skeletonProps={{ height: 16, shape: 'rounded' }}
            />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <Skeleton width={32} height={32} shape="circle" />
              <Skeleton width={120} height={16} shape="rounded" />
            </View>
          </View>
        </Card>

        <Divider spacing="md" />
        <Text typography="h5">List Item Loading</Text>

        <Card type="outlined">
          <View gap="md">
            {[1, 2, 3].map((item) => (
              <View key={item} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Skeleton width={48} height={48} shape="rounded" />
                <View style={{ flex: 1, gap: 8 }}>
                  <Skeleton width="70%" height={18} shape="rounded" />
                  <Skeleton width="50%" height={14} shape="rounded" />
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Divider spacing="md" />
        <Text typography="h5">Table Loading</Text>

        <Card type="outlined">
          <View gap="sm">
            {/* Header */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Skeleton width={40} height={20} shape="rounded" />
              <Skeleton width="25%" height={20} shape="rounded" />
              <Skeleton width="25%" height={20} shape="rounded" />
              <Skeleton width="25%" height={20} shape="rounded" />
            </View>
            <Divider spacing="sm" />
            {/* Rows */}
            {[1, 2, 3, 4, 5].map((row) => (
              <View key={row} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Skeleton width={40} height={16} shape="rounded" />
                <Skeleton width="25%" height={16} shape="rounded" />
                <Skeleton width="25%" height={16} shape="rounded" />
                <Skeleton width="25%" height={16} shape="rounded" />
              </View>
            ))}
          </View>
        </Card>

        <Divider spacing="md" />
        <Text typography="h5">Dashboard Card Loading</Text>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((card) => (
            <Card key={card} type="outlined" style={{ flex: 1, minWidth: 180 }}>
              <View gap="sm">
                <Skeleton width="60%" height={16} shape="rounded" />
                <Skeleton width="80%" height={32} shape="rounded" />
                <Skeleton width="40%" height={12} shape="rounded" />
              </View>
            </Card>
          ))}
        </View>

        <Divider spacing="md" />
        <Text typography="h5">Comment Thread Loading</Text>

        <Card type="outlined">
          <View gap="md">
            {[1, 2, 3].map((comment) => (
              <View key={comment} style={{ paddingLeft: comment > 1 ? 32 : 0 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Skeleton width={40} height={40} shape="circle" />
                  <View style={{ flex: 1, gap: 8 }}>
                    <Skeleton width="30%" height={16} shape="rounded" />
                    <SkeletonGroup
                      count={2}
                      spacing={6}
                      skeletonProps={{ height: 14, shape: 'rounded' }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Divider spacing="md" />
        <Text typography="h5">Mixed Shapes and Sizes</Text>

        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Skeleton width={80} height={80} shape="circle" />
          <Skeleton width={80} height={80} shape="rounded" borderRadius={16} />
          <Skeleton width={80} height={80} shape="rectangle" />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Skeleton width={24} height={24} shape="circle" />
          <Skeleton width={32} height={32} shape="circle" />
          <Skeleton width={48} height={48} shape="circle" />
          <Skeleton width={64} height={64} shape="circle" />
        </View>

        <Divider spacing="md" />
        <Text typography="h5">Custom Widths</Text>

        <Skeleton width={100} height={20} shape="rounded" />
        <Skeleton width="25%" height={20} shape="rounded" />
        <Skeleton width="50%" height={20} shape="rounded" />
        <Skeleton width="75%" height={20} shape="rounded" />
        <Skeleton width="100%" height={20} shape="rounded" />
      </View>
    </Screen>
  );
};
