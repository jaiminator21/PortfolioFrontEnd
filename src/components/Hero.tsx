import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';


export function Hero() {
 /*  const { user } = useAuth(); */

  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-600 mb-4 tracking-wide uppercase text-sm">
            Desarrollador Web
          </p>
          <h1 className="mb-6">
            Frontend / Full Stack Developer
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl">
            Especializado en aplicaciones web escalables, rendimiento y experiencia de usuario
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            Transformo requisitos complejos en interfaces intuitivas y eficientes que impulsan el crecimiento del producto
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              /* to={user ? "/proyectos-profesionales" : "/login"} */
              className="px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2 group"
            >
              Ver proyectos profesionales
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              /* to="/proyectos-personales" */
              className="px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
            >
              Proyectos personales
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}