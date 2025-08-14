import React from 'react'
import DocumentEditor from './components/DocumentEditor'

function App() {
  return (
    <div className="min-h-screen">
      <DocumentEditor
        initialContent={`
          <h1>Legal Document Template</h1>
          <p>This is a demonstration of a professional document editor with A4 pagination support. The editor automatically handles page breaks when content exceeds the page boundaries.</p>
          
          <h2>Key Features</h2>
          <ul>
            <li>Automatic pagination with A4 page size constraints</li>
            <li>Manual page break insertion using Ctrl+Enter</li>
            <li>Dynamic headers and footers with page numbers</li>
            <li>Print and export functionality</li>
            <li>Professional document formatting</li>
          </ul>
          
          <h2>Sample Content</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          
          <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          
          <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
          
          <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.</p>
          
          <p>Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
        `}
        onContentChange={(content) => {
          // Handle content changes for autosave, etc.
          console.log('Content updated:', content.length, 'characters')
        }}
      />
    </div>
  )
}

export default App