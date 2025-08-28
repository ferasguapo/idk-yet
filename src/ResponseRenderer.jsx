import { ExternalLink } from 'lucide-react'

export default function ResponseRenderer({ reply }) {
  if (!reply) return null

  const Section = ({ title, children }) => (
    <section className="p-5 rounded-2xl glass">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </section>
  )

  const List = ({ items }) => (
    <ul className="space-y-2 list-decimal pl-6">
      {items?.map((t, i) => <li key={i} className="leading-relaxed">{t}</li>)}
    </ul>
  )

  const LinkList = ({ items }) => (
    <ul className="space-y-1 pl-1">
      {items?.map((url, i) => (
        <li key={i}>
          <a href={url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> {url}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <div className="space-y-5 text-slate-100">
      <Section title="🔧 Overview">
        <p className="leading-relaxed">{reply.overview}</p>
      </Section>

      <div className="grid md:grid-cols-2 gap-5">
        <Section title="🧪 Diagnostic Steps">
          <List items={reply.diagnostic_steps} />
        </Section>
        <Section title="🛠️ Repair Steps">
          <List items={reply.repair_steps} />
        </Section>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Section title="🧰 Tools">
          <List items={reply.tools} />
        </Section>
        <Section title="🧩 Parts">
          <List items={reply.parts} />
        </Section>
      </div>

      <Section title="📝 Notes">
        <List items={reply.notes} />
      </Section>

      <div className="grid md:grid-cols-2 gap-5">
        <Section title="📚 Resources">
          <LinkList items={reply.resources} />
        </Section>
        <Section title="🎥 Videos">
          <LinkList items={reply.videos} />
        </Section>
      </div>
    </div>
  )
}
