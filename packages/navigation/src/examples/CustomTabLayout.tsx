import { Button, View, Text } from "@idealyst/components";
import { TabLayoutProps } from "src/routing";

export default function CustomTabLayout({
    routes,
    options,
    ContentComponent,
    onNavigate,
    currentPath
}: TabLayoutProps) {

    const HeaderTitle = options?.headerTitle;

    return (
        <View>
            <View>
                {HeaderTitle ? <HeaderTitle /> : <Text>Custom Tab Layout</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}>
                {routes.map(route => (
                    <Button
                        variant={currentPath === route.path ? 'contained' : 'outlined'}
                        key={route.path}
                        onPress={() => onNavigate(route.path)}
                        style={{ margin: 4 }}
                    >
                        {route.path === '/' ? 'Home' : route.path}
                    </Button>
                ))}
            </View>
            <View>
                <ContentComponent />
            </View>
        </View>
    )

}