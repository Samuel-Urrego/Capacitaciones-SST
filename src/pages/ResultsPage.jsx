export default function ResultsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-800">Resultado</h1>
        <p className="mt-2 text-slate-500">
          Acá se muestra el puntaje del quiz y si aprobó o no.
        </p>
      </div>
    </div>
  )
}
