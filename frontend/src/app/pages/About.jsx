import React from 'react';
import Team_section from '../components/Team_section';
const About = () => {
    return (
        <section id="about" className="py-24 relative">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto ">
                <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
                    <div className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
                        <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex mb-4">
                            <img className="rounded-xl object-cover" src="/womanhands.jpg" alt="about Us image" />
                        </div>
                        <img className="sm:ml-0 ml-auto rounded-xl object-cover mb-4" src="/gesture-recognizer.png" alt="about Us image" />
                    </div>
                    <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                        <div className="w-full flex-col justify-center items-start gap-8 flex">
                            <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                                <h2 className="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                                    Shape & Sign
                                </h2>
                                <p className="text-gray-800 text-base font-normal leading-relaxed lg:text-start text-center">
                                    Shape & Sign designed to teach American Sign Language (ASL) letters, phrases, and shape matching serves as a powerful resource for early learning and communication development. By integrating sign language with shape recognition, it effectively aids children, particularly those with disabilities, in enhancing both cognitive and motor skills. The activity of matching hand gestures to corresponding shapes promotes fine motor coordination, spatial awareness, and pattern recognition, making the learning process more interactive and engaging.
                                    <br />
                                    <br />
                                    For parents and caregivers, this platform offers a structured method to support communication at home, reinforcing language development while fostering a strong bond between parent and child. Educators and therapists can incorporate it into classrooms and therapy sessions, facilitating hands-on, visual learning that helps children acquire essential skills.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <Team_section />
        </section>
    );
};

export default About;
