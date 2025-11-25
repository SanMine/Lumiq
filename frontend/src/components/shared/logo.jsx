const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-bold text-sm">L</span>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
        Lumiq
      </span>
    </div>
  );
};

export default Logo;