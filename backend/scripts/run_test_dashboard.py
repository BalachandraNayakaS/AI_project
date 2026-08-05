import runpy
import sys


if __name__ == '__main__':
    g = runpy.run_path('tests/test_dashboard_and_customers.py')
    setup = g.get('setup_module')
    test = g.get('test_customers_and_dashboard')
    teardown = g.get('teardown_module')
    try:
        if setup:
            setup(None)
        test()
        print('TEST PASSED')
        rc = 0
    except AssertionError as e:
        print('TEST FAILED:', e)
        rc = 2
    except Exception as exc:
        print('TEST ERROR:', exc)
        rc = 3
    finally:
        try:
            if teardown:
                teardown(None)
        except Exception:
            pass
    sys.exit(rc)
