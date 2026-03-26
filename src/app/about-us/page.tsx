import About from "../components/about";
import Header from "../components/header";
import Footer from "../components/footer";
import Contact from "../components/contact";
export default function AboutUs(){
    return(
        <main>
            <Header />
            <About/>
            <Contact backgroundColor="bg-wannapet-dark" />
            <Footer/>
        </main>
    )
}