export type ShadowVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type ShadowValue = {
    // Android: elevation value
    elevation: number;

    // iOS: shadow properties
    shadowColor: string;
    shadowOffset: {
        width: number;
        height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    boxShadow?: string;
} | {}

export type AllShadowTypes = Record<ShadowVariant, ShadowValue>;