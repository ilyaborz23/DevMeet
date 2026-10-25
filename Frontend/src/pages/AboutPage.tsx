function AboutPage() {
  return (
    <section className="about">
      <header className="about-head">
        <p className="overline">About</p>
        <h1>A timetable, not a calendar.</h1>
        <p className="about-lead">
          DevMeet is a meeting management system for the development teams of a high-tech company.
          Calendars show everything; DevMeet shows one team at a time — what is next, how long it
          takes and where it happens.
        </p>
      </header>

      <ol className="about-sections">
        <li>
          <span className="about-num" aria-hidden="true">01</span>
          <div>
            <h2>The system</h2>
            <p>
              Each team — UI, Mobile, React, Backend — has its own schedule. Every meeting has a
              start and end time, a description and a room.
            </p>
            <ul>
              <li>Browse the meetings of one team, with the duration of each meeting</li>
              <li>Upcoming meetings are marked orange, past meetings green</li>
              <li>Book a new meeting — it cannot start in the past or end before it starts</li>
              <li>Edit or delete any existing meeting</li>
            </ul>
          </div>
        </li>
        <li>
          <span className="about-num" aria-hidden="true">02</span>
          <div>
            <h2>Under the hood</h2>
            <dl className="spec">
              <dt>Client</dt>
              <dd>React + TypeScript, Vite, React Router</dd>
              <dt>Server</dt>
              <dd>Node.js + TypeScript, Express, RESTful API</dd>
              <dt>Database</dt>
              <dd>PostgreSQL on Neon</dd>
            </dl>
          </div>
        </li>
        <li>
          <span className="about-num" aria-hidden="true">03</span>
          <div>
            <h2>Developer</h2>
            <dl className="spec">
              <dt>Name</dt>
              <dd>Ilya Borzyh</dd>
              <dt>Email</dt>
              <dd><a href="mailto:ilyaborzyh666@gmail.com">ilyaborzyh666@gmail.com</a></dd>
              <dt>GitHub</dt>
              <dd>
                <a href="https://github.com/ilyaborz23" target="_blank" rel="noopener noreferrer">
                  github.com/ilyaborz23
                </a>
              </dd>
            </dl>
          </div>
        </li>
      </ol>
    </section>
  )
}

export default AboutPage
