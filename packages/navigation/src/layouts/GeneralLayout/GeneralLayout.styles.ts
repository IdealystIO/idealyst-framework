// Simple style objects for the GeneralLayout
export const generalLayoutStyles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  } as const,
  
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    zIndex: 100,
  } as const,
  
  bodyContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
  } as const,
  
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease-in-out',
    overflow: 'hidden',
    zIndex: 50,
  } as const,
  
  sidebarContent: {
    flex: 1,
    overflow: 'auto',
  } as const,
  
  sidebarToggle: {
    alignSelf: 'flex-end',
    margin: '8px',
    marginBottom: '16px',
  } as const,
  
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    order: 2,
  } as const,
  
  contentArea: {
    flex: 1,
    overflow: 'auto',
  } as const,
};
