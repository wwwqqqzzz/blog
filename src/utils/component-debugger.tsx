import React from 'react'

/**
 * A higher-order component that wraps a component with error boundary and debugging
 * @param Component The component to wrap
 * @param componentName The name of the component (for debugging)
 */
export function withErrorBoundary<P>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  class ComponentErrorBoundary extends React.Component<P, { hasError: boolean; error: Error | null }> {
    constructor(props: P) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error(`Error in ${componentName}:`, error)
      console.error('Component stack:', errorInfo.componentStack)
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{
            padding: '10px',
            margin: '10px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '4px'
          }}>
            <h3>Error in {componentName}</h3>
            <p>{this.state.error?.message || 'Unknown error'}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                padding: '5px 10px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )
      }

      return <Component {...this.props} />
    }
  }

  // Set display name for debugging
  ComponentErrorBoundary.displayName = `withErrorBoundary(${componentName})`

  return ComponentErrorBoundary
}

/**
 * A utility to wrap all components in a module with error boundaries
 * @param module The module containing components
 * @returns The module with all components wrapped with error boundaries
 */
export function wrapModuleWithErrorBoundaries<T extends Record<string, any>>(
  module: T,
  moduleName: string
): T {
  const wrappedModule = { ...module }

  Object.keys(module).forEach(key => {
    const component = module[key]
    if (
      typeof component === 'function' &&
      (component.prototype?.isReactComponent || // Class component
        component.$$typeof === Symbol.for('react.forward_ref') || // ForwardRef
        component.$$typeof === Symbol.for('react.memo')) // Memo
    ) {
      wrappedModule[key] = withErrorBoundary(component, `${moduleName}.${key}`)
    }
  })

  return wrappedModule
}

/**
 * A component that renders its children with an error boundary
 */
export function SafeRender({ 
  children, 
  componentName = 'Unknown' 
}: { 
  children: React.ReactNode, 
  componentName?: string 
}): React.ReactElement {
  const ErrorBoundary = withErrorBoundary(
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
    componentName
  )
  
  return <ErrorBoundary>{children}</ErrorBoundary>
}
