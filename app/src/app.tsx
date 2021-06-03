import './app.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useDebounce } from 'use-debounce';

const MIN_QUERY_LENGTH = 3;
const SEARCH_DELAY = 50;

function App(): JSX.Element {
  const [query, setQuery] = React.useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  const [debouncedQuery] = useDebounce(query, SEARCH_DELAY);

  const [matches, setMatches] = React.useState<string[]>();

  React.useEffect(() => {
    async function search() {
      const response = await window.api.search(debouncedQuery);
      setMatches(response);
    }
    if (debouncedQuery.length >= MIN_QUERY_LENGTH) {
      search();
    } else {
      setMatches([]);
    }
  }, [debouncedQuery]);

  return (
    <div className="w-full">
      <div className="bg-white px-4 sticky top-0 z-50">
        <input
          autoFocus
          className="border-b-2 focus:outline-none py-4 w-full"
          onChange={handleChange}
          placeholder="Search"
          type="text"
          value={query}
        />
      </div>
      <div className="overflow-y-auto p-4 relative">
        <ul>
          {matches !== undefined
            ? matches.map((match) => <li key={match}>{match}</li>)
            : null}
        </ul>
      </div>
    </div>
  );
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
