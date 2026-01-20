import Navbar from '@/components/Navbar';
import careerFairBanner from '@/assets/tribunal-career-fair-banner.jpg';
import professionalCareerFair from '@/assets/170914jfFallCareerWeek0466.jpg';
import eveningWithIndustry from '@/assets/EVENING WITH INDUSTRY PIC_0.jpeg';
import technicalCareerFair from '@/assets/170914jfFallCareerWeek0352.jpg';
import interviewDays from '@/assets/170914jfFallCareerWeek0378.jpg';
import arrow from '@/assets/arrow.png';

export default function CareerFairPage() {
  return (
    <div className="w-screen">
      <Navbar />
      {/* Hero Banner Section */}
      <section className="relative w-full">
        <div className="relative w-full">
          <img
            src={careerFairBanner}
            alt="Career Fair Banner"
            className="w-full h-[200px] object-cover"
          />
          <div className="absolute inset-0 bg-red-900/60"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-white text-6xl md:text-8xl font-extralight text-center uppercase tracking-widest z-10">
              CAREER WEEK
            </h1>
           
            <h3 className="text-white text-2xl md:text-4xl font-extralight text-center uppercase tracking-widest z-10">SPRING 2026 - COMING SOON!</h3>
          </div>
        </div>
      </section>

      {/* Business Career Fair Section */}
      <section className="flex flex-col items-center mt-10">
      
        <div className="w-3/5">        
          <div className="flex flex-col gap-y-4">
            <div className="w-full pt-4 bg-red-500 flex flex-col justify-between items-center text-white gap-y-2 tracking-wide text-center mb-10 rounded-xl shadow- hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h1 className="text-5xl font-light leading-tight">
                Professional Career Fair <br />
                Campus Recreation Center
              </h1>
              <h2 className="text-xl">TBD</h2>
              <p className="text-xl">Time TBD</p>
              <a
                href="https://app.joinhandshake.com/stu/career_fairs/44927"
                className="bg-white w-full h-8 flex items-center justify-center text-red-500 shadow text-xl font-medium gap-x-1 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Join
                <img src={arrow} alt="arrow" className="h-7" />
              </a>
            </div>

            <div className="w-full pt-4 bg-red-500 flex flex-col justify-between items-center text-white text-center gap-y-2 mb-10 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h1 className="text-5xl font-light leading-tight">
                Technical Career Fair <br />
                Campus Recreation Center <br />
                (Engineering and IT) <br />
                and <br />
                TUC Great Hall (Construction, Civil, and Architectural Engineering)
              </h1>
              <h2 className="text-xl">TBD</h2>
              <p className="text-xl">Time TBD</p>
              <a
                href="https://app.joinhandshake.com/stu/career_fairs/44927"
                className="bg-white w-full h-8 flex items-center justify-center text-red-500 shadow text-xl font-medium gap-x-1 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                Join
                <img src={arrow} alt="arrow" className="h-7" />
              </a>
            </div>

            <div className="w-full py-4 bg-slate-700 flex flex-col justify-between items-center text-white text-center gap-y-2 mb-10 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h1 className="text-5xl font-light leading-tight">Employer Interviews</h1>
              <h2 className="text-xl">Friday, TBD</h2>
              <p className="text-xl">Time TBD</p>
            </div>

            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-extralight py-4 border border-y-4 border-x-0 border-solid border-red-500 text-center">
                About
              </h1>
              <p>
                The University of Cincinnati and the College of Engineering and Applied Science Tribunal are thrilled to
                welcome both employers and students to campus for the Fall 2024 Career Week. The University of Cincinnati
                Fall Career Week provides students and employers the opportunity to network, interview, and connect
                through both professional and informal events over the course of five (5) days. Whether looking to hire
                full-time or part-time, co-op or intern, employers will find an incredibly talented and diverse pool of
                CEAS candidates. We look forward to hosting you this Fall.
              </p>
              <p>
                To learn more about the incredible opportunities offered as a part of the Fall 2024 Career Week please
                see the general information below!
              </p>
              <p>
                Once again, students are REQUIRED to register in advance for our the Fall 2024 Career Fair. While waiting
                for the fair, students are encouraged to prepare by saving the fair on Handshake and viewing employers
                currently registered for the Fall 2024 Career Fair.
              </p>
              <p>
                Questions? Be sure to follow us on Instagram{' '}
                <a
                  href="https://www.instagram.com/uc_careerfair/"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  @uc_careerfair
                </a>{' '}
                to receive the most up-to-date information regarding the Fall 2024 Career Week!
              </p>
              <img
                src={professionalCareerFair}
                alt="Fall Career Week"
                className="w-full shadow rounded"
              />
              <h1 className="text-2xl font-bold">
                <span className="text-red-500">—</span> Resume Review Day - date tbd
              </h1>
              <p>
                Resume Review Day gives students an opportunity to get their resume reviewed by industry leaders before
                attending the Career Fair. It's a great way to begin preparing and allows students to meet employers in
                advance. Returning Fall 2024, students attending Resume Review Day will have the opportunity to also
                attend a preemptive student-led resume workshop to further develop and refine their resumes. It is
                strongly recommended that all underclassmen register to attend both sessions.
              </p>
              <p>
                This is an incredible opportunity with limited capacity, so students are encouraged to sign-up in
                September.
              </p>
              <img
                src={eveningWithIndustry}
                alt="Evening w/ Industry"
                className="w-full shadow rounded"
              />
              <h1 className="text-2xl font-bold">
                <span className="text-red-500">—</span> Professional Career Fair
              </h1>
              <p>
                The Professional Career Fair is targeted towards employers planning to hire students or recent graduates
                for full-time and internship positions outside of the engineering fields. Graduate schools are also
                invited to attend. A wide variety of majors are included in this fair.
              </p>
              <p>
                To see the full list of majors attending the Professional Career Fair, you can filter through your major
                of interest{' '}
                <a
                  href="https://uc.joinhandshake.com/career_fairs/20866?ref=events-search#employers"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  here
                </a>
                .
              </p>
              <p>
                The Professional Career Fair is held in the Campus Recreation Center on University of Cincinnati's main
                campus. Employers are invited to purchase one or more booths and may bring a display and materials to
                distribute to students. Lunch is included, complimentary WiFi is available, and day-of power can be
                accessed for an additional fee during registration.
              </p>

              <img
                src={technicalCareerFair}
                alt="Career Fair"
                className="w-full shadowed rounded"
              />
              <h1 className="text-2xl font-bold">
                <span className="text-red-500">—</span> Technical Career Fair
              </h1>
              <p>
                The Technical Career Fair is targeted toward employers looking to hire technical majors for full-time,
                co-op, and internship positions. Most of these students participate in the University of Cincinnati's
                mandatory co-operative education program. A wide variety of majors are included in this fair, including
                majors in the following categories but not limited to:
              </p>
              <ul className="list-disc ml-4">
                <li>Engineering</li>
                <li>Engineering Technology</li>
                <li>Information Technology</li>
                <li>Operations</li>
              </ul>

              <p>
                To see the full list of majors attending the Technical Career Fair, you can filter through your major of
                interest{' '}
                <a
                  href="https://app.joinhandshake.com/stu/career_fairs/33816?ref=school-show-upcoming-career-fairs"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  here
                </a>
                .
              </p>
              <p>
                The Technical Career Fair is held in the Campus Recreation Center and Tangeman University Center on
                University of Cincinnati's main campus. Employers are invited to purchase one or more booths and may
                bring a display and materials to distribute to students. Lunch will be served, complimentary WiFi is
                available, and day-of power can be accessed for an additional fee during registration.
              </p>
              <img
                src={interviewDays}
                alt="Career Fair"
                className="w-full shadowed rounded"
              />
              <h1 className="text-2xl font-bold">
                <span className="text-red-500">—</span> Interview Days
              </h1>
              <p>
                The Career Fair Week Interview Days offer an opportunity for employers participating in the Career Fair
                to meet with their top candidates one-on-one for 30-minute interviews on-campus the Friday (September
                20th) following the Professional and Technical Career Fairs.
              </p>
              <p>
                Employers may participate in Interview Day free of charge by clicking on the Interview Day box during
                registration and selecting the desired number of interview booths.
              </p>
              <p>
                Employers are to schedule their own interviews directly with student candidates at a mutually agreeable
                time. At the start of the fair, you will receive a blank interview schedule with a number of 30-minute
                time blocks from 10:00 a.m. to 3:00 p.m. Fill in your schedule as you talk with candidates, and turn in
                the carbon copy of your schedule at Employer Check-Out.
              </p>
            </div>

            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-extralight py-4 border-y-4 border-solid border-red-500 text-center">
                Resume Review Day
              </h1>
              <div className="w-full pt-4 bg-red-500 flex flex-col justify-between items-center text-white gap-y-2 tracking-wide text-center rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <h1 className="text-5xl font-light leading-tight">Engineering Resume Review Day - date tbd</h1>
                <h2 className="text-xl">TBD</h2>
                <p className="text-xl px-6 mb-4">
                  Resume Review Day gives students an opportunity to get their resume reviewed by industry leaders before
                  attending the Career Fair. It is a great way to get prepared and it also allows students to meet
                  employers in advanced. Returning in Spring 2025 students attending Resume Review Day will have the
                  opportunity to also attend a preemptive student-led resume workshop to further develop and refine their
                  resumes.
                </p>

                <a
                  href="https://app.joinhandshake.com/stu/career_fairs/44927"
                  className="bg-white w-full h-8 flex items-center justify-center text-red-500 rounded-lg shadow text-xl font-medium gap-x-1 hover:scale-105 transition-transform duration-300"
                >
                  Join
                  <img src={arrow} alt="arrow" className="h-7" />
                </a>
              </div>
              <div className="w-full pt-4 bg-red-500 flex flex-col justify-between items-center text-white gap-y-2 tracking-wide text-center rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <h1 className="text-5xl font-light leading-tight">Business Resupalooza</h1>
                <h2 className="text-xl">TBD</h2>
                <p className="text-xl px-6 mb-4">
                  Lindner business students, come get your resume reviewed before the Career Fair! This is an opportunity
                  to meet with an employer representative one-on-one to go over your resume and ask questions. This will
                  take place virtually and you will be expected to screen share your resume.
                </p>

                <a
                  href="https://app.joinhandshake.com/stu/career_fairs/44927"
                  className="bg-white w-full h-8 flex items-center justify-center text-red-500 rounded-lg shadow text-xl font-medium gap-x-1 hover:scale-105 transition-transform duration-300"
                >
                  Join
                  <img src={arrow} alt="arrow" className="h-7" />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-extralight py-4 border-y-4 border-solid border-red-500 text-center">
                How to Prepare
              </h1>
              <p>In-Person Career Fair:</p>
              <ul className="list-disc ml-4">
                <li>Review the list of companies that will be there.</li>
                <li>Research employers that interest you.</li>
                <li>Prepare a brief (30-second) self-introduction (e.g., name, major, year, and one question).</li>
                <li>Attend Resume Review Days.</li>
                <li>
                  Attend company information sessions. Information sessions let you learn about a company's culture,
                  hiring process, and current hiring priorities from someone who actually works there. Look for
                  information sessions in Handshake within two weeks of the fair.
                </li>
                <li>Plan to spend 1-2 hours at the fair.</li>
                <li>
                  Read our{' '}
                  <a
                    href="https://www.uc.edu/campus-life/careereducation/career-studio/job-search/where-to-look/prepare-career-fair.html"
                    className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                  >
                    Student Best Practices
                  </a>{' '}
                  for a universal guide on job-seeking at career fairs
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-extralight py-4 border-y-4 border-solid border-red-500 text-center">
                What to Wear and Bring
              </h1>
              <p>What to Wear and Bring:</p>
              <ul className="list-disc gap-y-1 ml-4">
                <li>Wear business professional. No student will be admitted wearing jeans, tennis shoes, or t-shirts</li>
                <li>
                  See{' '}
                  <a
                    href="https://www.instagram.com/uc_careerfair/"
                    className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                  >
                    @uc_careerfair
                  </a>{' '}
                  on Instagram for resources on getting dress attire!
                </li>
                <li>Bring your Bearcat Card (student ID)</li>
                <li>Bring a folder or portfolio with five to fifteen copies of your resume, a note pad and pen</li>
                <li>
                  Coat and bag check is available, but you can skip the line and save time by leaving your coat and
                  backpack at home or in a secure place while you're at the fair. The Campus Recreation Center has a
                  limited number of day-use lockers with built-in locks that members and non-members can use for free
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-extralight py-4 border-y-4 border-solid border-red-500 text-center">
                Volunteer
              </h1>
              <p>
                We provide the opportunity to volunteer at the Career Fair on any of the three days. Volunteering at the
                Career Fair will give you great opportunity to get involved with your college's student government. It
                will also provide you with the opportunity to network with company representatives.
              </p>
              <p>
                Additional information regarding volunteer opportunities and volunteer registration information for the
                Fall 2024 Career Week will be emailed to students in the weeks leading up to the event.
              </p>
              <p>
                Professional dress is required for all volunteers. Contact{' '}
                <a href="mailto:uccareerfair@gmail.com">uccareerfair@gmail.com</a> for more information.
              </p>
            </div>

            <div className="flex flex-col gap-y-4">
              <h1 className="text-6xl font-extralight py-4 border-y-4 border-solid border-red-500 text-center">
                Employer Information
              </h1>
              <h1 className="text-xl">Information Sessions & Tabling</h1>
              <p>
                If you would like to schedule an information session or table in the Lindner College of Business, please
                contact Andrew Wellendorf (
                <a
                  href="mailto:Andrew.Wellendorf@uc.edu"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  Andrew.Wellendorf@uc.edu
                </a>
                ) or visit this{' '}
                <a
                  href="https://forms.office.com/Pages/ResponsePage.aspx?id=bC4i9cZf60iPA3PbGCA7Y3dIyCZv0NpJqSQRC9Q5e7lUNUVSWDFPT1I2QjJaTEJLTlcyNE5PMEpVMi4u"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  form
                </a>
                . Otherwise, request an event in Handshake. See How to Request an Event{' '}
                <a
                  href="https://support.joinhandshake.com/hc/en-us/articles/360001027648-How-to-Request-an-Event"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  here
                </a>{' '}
                and Understanding Event Formats in Handshake{' '}
                <a
                  href="https://support.joinhandshake.com/hc/en-us/articles/360024368993-Understanding-Event-Formats-in-Handshake"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  here
                </a>
                . Requests for on-campus events should be made at least two weeks prior to the desired event date.
              </p>

              <h1 className="text-xl">Resume Review Day</h1>
              <p>
                The Technical Resume Review Day is an event hosted by the Engineering and Applied Science Tribunal in
                order to help prepare students for the Career Fair. This event gives students the opportunity to sign up
                for 20-minute intervals to receive resume feedback from industry leaders and gives students the ability
                to network with employers before the Technical Career Fair.
              </p>
              <p>
                It is also used as a chance for employers to build student relations, as well as get face-to-face time
                with additional students that might be seeking a co-op at no cost to them.
              </p>
            </div>

            <div className="flex flex-col gap-y-4 mb-4">
              <h1 className="text-6xl font-extralight py-4 border-y-4 border-solid border-red-500 text-center">
                Contact Us
              </h1>
              <p>
                The UC Career Week is organized by the{' '}
                <a
                  href="http://tribunal.uc.edu/"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  Engineering & Applied Science Tribunal
                </a>
                ,{' '}
                <a
                  href="https://business.uc.edu/career-services.html"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  Lindner College of Business Career Services Center
                </a>
                , and the{' '}
                <a
                  href="https://www.uc.edu/campus-life/careereducation.html"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  College of Cooperative Education and Professional Studies
                </a>
                .
              </p>
              <p>
                Should you have any questions, please contact us at{' '}
                <a href="tel:+15135567234" className="text-blue-500 hover:underline hover:underline-offset-[3px]">
                  (513) 556-7234
                </a>{' '}
                or{' '}
                <a
                  href="mailto:uccareerfair@gmail.com"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  uccareerfair@gmail.com
                </a>{' '}
                for the Career Development Team or{' '}
                <a
                  href="mailto:careereducation@uc.edu"
                  className="text-blue-500 hover:underline hover:underline-offset-[3px]"
                >
                  careereducation@uc.edu
                </a>{' '}
                for our Marketing & Events Manager. Thank you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Sections */}
      <div className="bg-red-500 py-8 text-white">
        <div className="max-w-7xl mx-auto px-4tex sm:px-6 lg:px-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Want an opportunity to contribute within CEAS</h2>
          <button className="bg-white text-red-500 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white">
            Get Involved
          </button>
        </div>
      </div>

      <div className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">Committees</h3>
            <ul>
              <li>Academic Affairs</li>
              <li>Career Development</li>
              <li>Communications</li>
              <li>ESOC</li>
              <li>EWeek</li>
              <li>FELD</li>
              <li>Innovation</li>
              <li>Luau+</li>
              <li>Special Events</li>
              <li>Technology</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">ESOC</h3>
            <ul>
              <li>Baldwin Table Reservations</li>
              <li>Funding Guide</li>
              <li>TV Ad Submission</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Important Documents</h3>
            <ul>
              <li>Meeting Minutes</li>
              <li>Student Bill of Rights</li>
              <li>Tribunal ByLaws</li>
              <li>Tribunal Constitution</li>
            </ul>
            <h3 className="text-lg font-bold mb-2 mt-4">Stay Connected</h3>
            <ul>
              <li>Facebook</li>
              <li>Twitter</li>
            </ul>
            <h3 className="text-lg font-bold mb-2 mt-4">Already an exec member of CEAS Tribunal?</h3>
            <div className="mt-2">
              <a href="#" className="text-white hover:underline">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

