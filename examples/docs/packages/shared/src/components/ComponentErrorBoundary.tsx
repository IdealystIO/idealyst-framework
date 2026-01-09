import React, { Component, ReactNode } from 'react';
import { View, Text, Card } from '@idealyst/components';

interface Props {
  children: ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for catching component render errors in documentation.
 * Displays a friendly error message instead of crashing the page.
 */
export class ComponentErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error rendering ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card type="outlined" style={{ padding: 24, borderColor: 'var(--color-error)' }}>
          <View style={{ gap: 8 }}>
            <Text weight="semibold" color="error">
              Failed to render {this.props.componentName}
            </Text>
            <Text typography="body2" color="secondary">
              This component requires sample props defined in its docs.ts file.
            </Text>
            {this.state.error && (
              <Text typography="caption" color="tertiary" style={{ fontFamily: 'monospace' }}>
                {this.state.error.message}
              </Text>
            )}
          </View>
        </Card>
      );
    }

    return this.props.children;
  }
}
