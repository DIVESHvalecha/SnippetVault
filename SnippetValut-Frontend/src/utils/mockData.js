export const MOCK_SNIPPETS = [
  {
    id: '1',
    title: 'React UseEffect Cleanup',
    description: 'A standard pattern for handling subscriptions and timers in React functional components to avoid memory leaks.',
    language: 'javascript',
    visibility: 'public',
    userId: 'other-user',
    code: `useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => clearInterval(timer);
}, []);`,
    createdAt: 'Oct 24, 2025'
  },
  {
    id: 'java-1',
    title: 'Java Stream Filter',
    description: 'A simple example of using Java Streams to filter a list of strings by their length.',
    language: 'java',
    visibility: 'public',
    userId: 12,
    code: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "Dave");
        List<String> result = names.stream()
            .filter(name -> name.length() > 3)
            .collect(Collectors.toList());
        
        System.out.println(result); // [Alice, Charlie, Dave]
    }
}`,
    createdAt: 'Feb 02, 2026'
  },
  {
    id: '2',
    title: 'PostgreSQL Connection Singleton',
    description: 'Ensuring only one database connection instance is created across the application lifecycle in Node.js.',
    language: 'javascript',
    visibility: 'private',
    userId: 12,
    code: `const { Pool } = require('pg');
let pool;

module.exports = {
  getPool: () => {
    if (!pool) {
      pool = new Pool();
    }
    return pool;
  }
};`,
    createdAt: 'Nov 12, 2025'
  },
  {
    id: '3',
    title: 'Flexbox Center Utility',
    description: 'Reliable CSS utility for centering content both vertically and horizontally using flexbox.',
    language: 'css',
    visibility: 'public',
    userId: 'other-user',
    code: `.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
    createdAt: 'Dec 05, 2025'
  },
  {
    id: '4',
    title: 'Group API Auth Middleware',
    description: 'Shared middleware for validating group-based access tokens in our internal microservices.',
    language: 'javascript',
    visibility: 'group',
    groupId: 'g1',
    userId: 12,
    code: `const validateGroupAccess = (req, res, next) => {
  const { groupId } = req.params;
  const userGroups = req.user.groups;
  
  if (userGroups.includes(groupId)) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};`,
    createdAt: 'Jan 15, 2026'
  },
  {
    id: '5',
    title: 'Python Data Cleanup Script',
    description: 'Quick script to remove null values and normalize column names in a pandas DataFrame.',
    language: 'python',
    visibility: 'private',
    userId: 'other-user',
    code: `import pandas as pd

def clean_data(df):
    df.dropna(inplace=True)
    df.columns = [c.lower().replace(' ', '_') for c in df.columns]
    return df`,
    createdAt: 'Jan 28, 2026'
  },
  {
    id: '6',
    title: 'Node.js Express Error Handler',
    description: 'Centralized error handling middleware for Express applications to ensure consistent API responses.',
    language: 'javascript',
    visibility: 'group',
    groupId: 'g2',
    userId: 'other-user',
    code: `app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});`,
    createdAt: 'Feb 01, 2026'
  },
  {
    id: '7',
    title: 'React Suspense with Data Fetching',
    description: 'Experimental pattern for using React Suspense to handle asynchronous data loading states.',
    language: 'javascript',
    visibility: 'group',
    groupId: 'g3',
    userId: 12,
    code: `const UserProfile = React.lazy(() => import('./UserProfile'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserProfile />
    </Suspense>
  );
}`,
    createdAt: 'Feb 02, 2026'
  }

];
