import { Link } from 'react-router-dom'
import heroImg from '../assets/meetings.svg'

function HomePage() {
  return (
    <section className="home">
      <div className="home-text">
        <p className="overline">Meeting timetable for dev teams</p>
        <h1 className="home-title">
          Every standup,<br />
          review and retro —<br />
          <span className="accent-upcoming">on schedule.</span>
        </h1>
        <p className="home-lead">
          DevMeet keeps the meetings of every development team in one clear timetable. Pick a team
          to see its schedule, book a room for the next sprint planning, or move and cancel a
          meeting in seconds. What is coming up glows <strong className="accent-upcoming">orange</strong>,
          what is already done turns <strong className="accent-past">green</strong>.
        </p>
        <Link to="/meetings" className="button">
          Open the schedule <span aria-hidden="true">→</span>
        </Link>
      </div>
      <figure className="home-figure">
        <img src={heroImg} alt="Departure-board style timetable listing upcoming meetings in orange and past meetings in green" />
      </figure>
    </section>
  )
}

export default HomePage
