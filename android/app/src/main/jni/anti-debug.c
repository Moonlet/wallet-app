#include <jni.h>
#include <unistd.h>
#include <sys/ptrace.h>
#include <sys/wait.h>
#include <pthread.h>

static int child_pid;

void *monitor_pid()
{

    int status;

    waitpid(child_pid, &status, 0);

    /* Child status should never change. */

    _exit(0); // Commit seppuku
}

void anti_debug()
{

    child_pid = fork();

    if (child_pid == 0)
    {
        int ppid = getppid();
        int status;

        if (ptrace(PTRACE_ATTACH, ppid, NULL, NULL) == 0)
        {
            waitpid(ppid, &status, 0);

            ptrace(PTRACE_CONT, ppid, NULL, NULL);

            while (waitpid(ppid, &status, 0))
            {

                if (WIFSTOPPED(status))
                {
                    ptrace(PTRACE_CONT, ppid, NULL, NULL);
                }
                else
                {
                    // Process has exited
                    _exit(0);
                }
            }
        }
    }
    else
    {
        pthread_t t;

        /* Start the monitoring thread */
        pthread_create(&t, NULL, monitor_pid, (void *)NULL);
    }
}

JNIEXPORT void JNICALL
Java_com_moonlet_MainActivity_antidebug(JNIEnv *env, jobject instance)
{
    anti_debug();
}