import Link from "next/link";
import { MessageSquare } from "lucide-react";

export function Footer() {
    return (
        <footer className="mt-auto border-t border-dashed border-border/40 bg-card/20 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 group w-max">
                            <div className="w-8 h-8 rounded-none bg-primary flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-foreground">
                                frankly<span className="text-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                            Create a personalized link, share it on your socials, and gather real, constructive, anonymous feedback from your peers.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-foreground">
                            Product
                        </h4>
                        <ul className="space-y-2 text-xs text-muted-foreground uppercase tracking-wide font-bold">
                            <li>
                                <Link href="/#features" className="hover:text-foreground transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/#demo" className="hover:text-foreground transition-colors">
                                    Live Demo
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                                    Dashboard Demo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Socials / Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-foreground">
                            Community
                        </h4>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/himanshuverse/frankly"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-none border border-dashed border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                                aria-label="View Frankly on GitHub"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-none border border-dashed border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                                aria-label="Twitter Link"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">
                            © {new Date().getFullYear()} frankly. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
